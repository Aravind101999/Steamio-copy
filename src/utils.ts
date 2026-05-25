import { StreamSource, MediaItem, Episode } from "./types";

export interface Config {
  quality: string;
  subtitles: boolean;
  hardwareDec: boolean;
  autoplay: boolean;
  serverUrl: string;
  language: string;
  debrid: string;
  torboxApiKey: string;
  notifications: boolean;
  autoUpdate: boolean;
  analytics: boolean;
  subtitleSize: string;
  subtitleColor: string;
}

export function getLocalConfig(): Config {
  const saved = localStorage.getItem("sg_stremio_cfg");
  const defaults: Config = {
    quality: "4K",
    subtitles: true,
    hardwareDec: true,
    autoplay: true,
    serverUrl: "https://streaming.strem.io",
    language: "English",
    debrid: "none",
    torboxApiKey: "",
    notifications: true,
    autoUpdate: true,
    analytics: false,
    subtitleSize: "medium",
    subtitleColor: "white",
  };
  if (saved) {
    try {
      return { ...defaults, ...JSON.parse(saved) };
    } catch {
      return defaults;
    }
  }
  return defaults;
}

export async function fetchTorBoxStream(magnet: string, apiKey?: string): Promise<{ streamUrl?: string; message?: string; error?: string }> {
  try {
    const response = await fetch("/api/torbox/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        magnet,
        userApiKey: apiKey || null,
      }),
    });

    const data = await response.json() as any;
    if (response.ok && data.success) {
      if (data.status === "metadata_dl") {
        return { error: "metadata_dl", message: data.message };
      }
      return { streamUrl: data.streamUrl };
    } else {
      return { error: data.error || "An integration error occurred with TorBox APIs." };
    }
  } catch (e: any) {
    return { error: e.message || "Failed to contact the streaming proxy server." };
  }
}
