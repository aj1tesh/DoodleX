"use client";

import { memo, useMemo } from "react";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";
import { Camera, Colour, Layer, LayerType, NoteLayer, TextLayer } from "@/types/canvas";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const FONT_FAMILIES: Array<{ label: string; value: string }> = [
  { label: "Kalam", value: "Kalam, ui-sans-serif, system-ui" },
  { label: "Sans", value: "ui-sans-serif, system-ui, -apple-system, Segoe UI" },
  { label: "Serif", value: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

interface FormatterProps {
  camera: Camera;
  setLastUsedColorForType: (layerType: LayerType, color: Colour) => void;
}

export const Formatter = memo(({ camera, setLastUsedColorForType }: FormatterProps) => {
  const selection = useSelf((me) => me.presence.selection ?? []);
  const layers = useStorage((root) => root.layers);

  const selectedLayers = useMemo(() => {
    return selection
      .map((id) => layers[id] as Layer | undefined)
      .filter(Boolean) as Layer[];
  }, [layers, selection]);

  const primary = selectedLayers[0];

  const hasSelection = selectedLayers.length > 0;
  const isTextLikeSelected = primary?.type === LayerType.Text || primary?.type === LayerType.Note;

  const currentFontFamily = isTextLikeSelected
    ? (primary as (TextLayer | NoteLayer) | undefined)?.fontFamily ?? ""
    : "";
  const currentFontSize = isTextLikeSelected
    ? (primary as (TextLayer | NoteLayer) | undefined)?.fontSize ?? ""
    : "";

  const setFill = useMutation(
    ({ storage, self }, fill: Colour) => {
      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection ?? []) {
        const layer = liveLayers.get(id);
        if (!layer) continue;
        layer.set("fill", fill);
        const type = layer.get("type") as LayerType;
        setLastUsedColorForType(type, fill);
      }
    },
    [setLastUsedColorForType],
  );

  const setFontFamily = useMutation(
    ({ storage, self }, fontFamily: string) => {
      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection ?? []) {
        const layer = liveLayers.get(id);
        const type = layer?.get("type") as LayerType | undefined;
        if (!layer || (type !== LayerType.Text && type !== LayerType.Note)) continue;
        // liveblocks layer typing can lag behind Layer union keys so we need to narrow safely.
        (layer as unknown as { set: (key: string, value: unknown) => void }).set("fontFamily", fontFamily);
      }
    },
    [],
  );

  const bumpFontSize = useMutation(
    ({ storage, self }, delta: number) => {
      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection ?? []) {
        const layer = liveLayers.get(id);
        const type = layer?.get("type") as LayerType | undefined;
        if (!layer || (type !== LayerType.Text && type !== LayerType.Note)) continue;

        const currentRaw = (layer as unknown as { get: (key: string) => unknown }).get("fontSize");
        const fallback = type === LayerType.Text ? 24 : 18;
        const current = typeof currentRaw === "number" ? currentRaw : fallback;
        const next = clamp(current + delta, 10, 96);
        (layer as unknown as { set: (key: string, value: unknown) => void }).set("fontSize", next);
      }
    },
    [],
  );

  void camera;

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 bg-white border shadow-sm rounded-xl px-3 py-2 flex items-center gap-2 select-none"
      style={{ zIndex: 50 }}
    >
      <div className={!hasSelection ? "opacity-50 pointer-events-none" : undefined}>
        <ColorPicker onChange={setFill} />
      </div>

      <div className={"flex items-center gap-2" + (!isTextLikeSelected ? " opacity-50" : "")}>
        <div className="text-xs font-semibold text-neutral-600">Font</div>
        <select
          className="h-9 rounded-md border border-neutral-200 px-2 text-sm bg-white"
          disabled={!hasSelection || !isTextLikeSelected}
          value={String(currentFontFamily)}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          <option value="" disabled>
            Default
          </option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className={"flex items-center gap-2 border-l border-neutral-200 pl-2" + (!isTextLikeSelected ? " opacity-50" : "")}>
        <div className="text-xs font-semibold text-neutral-600">Size</div>
        <Button
          variant="board"
          size="icon"
          disabled={!hasSelection || !isTextLikeSelected}
          onClick={() => bumpFontSize(-2)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="w-10 text-center text-sm tabular-nums">{isTextLikeSelected ? currentFontSize || "—" : "—"}</div>
        <Button
          variant="board"
          size="icon"
          disabled={!hasSelection || !isTextLikeSelected}
          onClick={() => bumpFontSize(2)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

Formatter.displayName = "Formatter";

