import type { CanvasPreset } from "@/types";

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: "square",
    name: "Square",
    width: 720,
    height: 720,
    icon: "□",
    description: "Standard square format",
  },
  {
    id: "instagram-post",
    name: "Instagram Post",
    width: 1080,
    height: 1080,
    icon: "▪",
    description: "1:1 - Instagram post",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    icon: "▯",
    description: "9:16 - Instagram story",
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    width: 1200,
    height: 630,
    icon: "▭",
    description: "1.91:1 - Facebook post",
  },
  {
    id: "twitter-post",
    name: "Twitter/X Post",
    width: 1200,
    height: 675,
    icon: "▬",
    description: "16:9 - Twitter/X post",
  },
  {
    id: "avatar",
    name: "Avatar",
    width: 400,
    height: 400,
    icon: "○",
    description: "Small profile picture",
  },
  {
    id: "slack-emoji",
    name: "Slack Emoji",
    width: 128,
    height: 128,
    icon: "◘",
    description: "128x128 - Slack custom emoji",
  },
  {
    id: "discord-emoji",
    name: "Discord Emoji",
    width: 128,
    height: 128,
    icon: "◘",
    description: "128x128 - Discord custom emoji",
  },
  {
    id: "emoji-hd",
    name: "Emoji HD",
    width: 256,
    height: 256,
    icon: "◙",
    description: "256x256 - High quality emoji",
  },
  {
    id: "emoji-ultra",
    name: "Emoji Ultra",
    width: 512,
    height: 512,
    icon: "●",
    description: "512x512 - Ultra HD emoji/sticker",
  },
  {
    id: "banner",
    name: "Banner",
    width: 1500,
    height: 500,
    icon: "▬",
    description: "Panoramic banner",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    icon: "▭",
    description: "16:9 - YouTube thumbnail",
  },
];

export const getPresetById = (id: string): CanvasPreset | undefined => {
  return CANVAS_PRESETS.find((preset) => preset.id === id);
};
