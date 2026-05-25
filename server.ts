import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dns from "dns";

// Prefer IPv4 for local loopback connections
dns.setDefaultResultOrder("ipv4first");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve parsed JSON bodies
  app.use(express.json());

  // GET: Retrieve configuration status (e.g. if the default env API key is loaded)
  app.get("/api/config", (req, res) => {
    res.json({
      fallbackKeySet: !!process.env.TORBOX_API_KEY,
    });
  });

  // POST: Add a magnet link to TorBox, find file, and construct a playable redirect link
  app.post("/api/torbox/play", async (req, res) => {
    try {
      const { magnet, userApiKey } = req.body;
      const apiKey = userApiKey || process.env.TORBOX_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          success: false,
          error: "TorBox API Key is missing. Please configure your TorBox API Key under settings.",
        });
      }

      if (!magnet) {
        return res.status(400).json({
          success: false,
          error: "Magnet link or hash is required for video streaming.",
        });
      }

      console.log(`Requesting TorBox create torrent on API. Magnet index key specified.`);

      // 1. Post to createtorrent endpoint
      const addRes = await fetch("https://api.torbox.app/v1/api/torrents/createtorrent", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          magnet: magnet,
          seed: 1, // Auto seed
        }),
      });

      const addResult = await addRes.json() as any;
      console.log("TorBox create torrent result:", addResult);

      if (!addResult.success && !addResult.id && !addResult.data) {
        return res.status(addRes.status || 400).json({
          success: false,
          error: addResult.detail || addResult.error || "Failed to create/add torrent on TorBox. Check that your API key is correct and valid.",
          raw: addResult,
        });
      }

      // TorBox returns IDs inside different fields based on version: data.torrent_id, data.id, or id
      const dataObj = addResult.data || {};
      let torrentId = dataObj.torrent_id || dataObj.id || addResult.id;

      // 2. Fetch the user's torrent list to inspect the files layout & download progress.
      const listRes = await fetch("https://api.torbox.app/v1/api/torrents/mylist", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      });

      const listResult = await listRes.json() as any;
      const torrents = listResult.data || listResult || [];

      // Find the matched torrent item
      let matchedTorrent = torrents.find((t: any) => t.id === torrentId);

      // If matching ID wasn't found directly, look for the most recently added or first active
      if (!matchedTorrent && torrents.length > 0) {
        matchedTorrent = torrents[0];
        torrentId = matchedTorrent.id;
      }

      if (!matchedTorrent) {
        return res.status(404).json({
          success: false,
          error: "Torrent was created on TorBox, but we could not find it inside your active list. Please refresh.",
        });
      }

      const files = matchedTorrent.files || [];
      if (files.length === 0) {
        return res.json({
          success: true,
          status: "metadata_dl",
          torrent_id: torrentId,
          message: "TorBox is currently downloading torrent metadata. Please give it a few seconds and try playing again.",
          streamUrl: null,
        });
      }

      // 3. Select the best media streaming candidate file (largest video file)
      const allowedVideoExtensions = [".mp4", ".mkv", ".webm", ".avi", ".mov", ".m4v"];
      const videoFiles = files.filter((f: any) => {
        const lowerName = (f.name || "").toLowerCase();
        return allowedVideoExtensions.some(ext => lowerName.endsWith(ext));
      });

      let chosenFile = null;
      if (videoFiles.length > 0) {
        // Sort by size to play the actual film/movie (usually largest size)
        videoFiles.sort((a: any, b: any) => (b.size || 0) - (a.size || 0));
        chosenFile = videoFiles[0];
      } else {
        // Fallback to first file in list
        chosenFile = files[0];
      }

      if (!chosenFile) {
        return res.status(404).json({
          success: false,
          error: "Torrent downloaded, but there are no streamable media files inside.",
        });
      }

      const fileId = chosenFile.id;

      // 4. Construct the TorBox redirect streaming permalink
      // Structure: https://api.torbox.app/v1/api/torrents/requestdl?token=APIKEY&torrent_id=NUMBER&file_id=NUMBER&redirect=true
      const redirectLink = `https://api.torbox.app/v1/api/torrents/requestdl?token=${apiKey}&torrent_id=${torrentId}&file_id=${fileId}&redirect=true`;

      return res.json({
        success: true,
        torrentId,
        fileId,
        fileName: chosenFile.name,
        fileSize: chosenFile.size,
        streamUrl: redirectLink,
      });

    } catch (err: any) {
      console.error("Torbox play API Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "An expected error happened on the Express server debrid proxy handler.",
      });
    }
  });

  // Serve client side application using Vite in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve client static production build out folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-Stack Server booting successfully on Port: http://localhost:${PORT}`);
  });
}

startServer();
