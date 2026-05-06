import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Camera } from "@/types/canvas";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#eab308",
  "#a855f7",
  "#ec4899",
  "#f97316",
];

export function getColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pointertoCanvas(
  e: React.PointerEvent,
  camera: Camera
) {
  const { clientX, clientY } = e;
  return {
    x: Math.round(clientX - camera.position.x),
    y: Math.round(clientY - camera.position.y),
  };
}