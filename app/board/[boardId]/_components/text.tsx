import { Kalam } from "next/font/google";
import { TextLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { cn, colourToCSS } from "@/lib/utils";

import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useEffect, useMemo, useRef } from "react";

const font = Kalam({
    weight: ["400"],
    subsets: ["latin"],
});

const MIN_TEXT_HEIGHT = 32;
const PADDING_Y = 8;
const AUTO_MAX_WIDTH = 720;
const TEXT_FONT_SIZE = 24;
const OVERFLOW_EPS = 2;

const ensureMeasurer = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    if (typeof document === "undefined") return null;
    if (ref.current) return ref.current;

    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.left = "-10000px";
    el.style.top = "-10000px";
    el.style.visibility = "hidden";
    el.style.pointerEvents = "none";
    el.style.padding = `${PADDING_Y}px 8px`;
    el.style.lineHeight = "1.25";
    el.style.whiteSpace = "pre-wrap";
    el.style.wordBreak = "break-word";
    el.style.overflowWrap = "anywhere";
    document.body.appendChild(el);

    ref.current = el;
    return el;
};

interface TextProps {
    id: string;
    layer: TextLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor: string | null;
}

export const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
    const { x, y, width, height, fill, value, fontFamily, fontSize } = layer;

    const contentRef = useRef<HTMLElement | null>(null);
    const measurerRef = useRef<HTMLDivElement | null>(null);

    const updateValueAndSize = useMutation(
        ({ storage }, newValue: string, nextWidth?: number, nextHeight?: number) => {
        const liveLayers = storage.get("layers");
        const liveLayer = liveLayers.get(id);
        if (!liveLayer) return;

        liveLayer.set("value", newValue);
        if (typeof nextWidth === "number" && Number.isFinite(nextWidth) && nextWidth > 0) {
            liveLayer.set("width", nextWidth);
        }
        if (typeof nextHeight === "number" && Number.isFinite(nextHeight) && nextHeight > 0) {
            liveLayer.set("height", Math.max(MIN_TEXT_HEIGHT, nextHeight));
        }
    }, []
    );

    const resizeToContent = useMemo(() => {
        return (newValue: string) => {
            requestAnimationFrame(() => {
                const el = contentRef.current;
                if (!el) return;

                // Always persist value; only change size if overflow is imminent.
                const overflowsY = el.scrollHeight > el.clientHeight + OVERFLOW_EPS;
                if (!overflowsY) {
                    updateValueAndSize(newValue);
                    return;
                }

                const measurer = ensureMeasurer(measurerRef);
                if (!measurer) {
                    updateValueAndSize(newValue);
                    return;
                }

                const computed = window.getComputedStyle(el);
                measurer.style.fontFamily = computed.fontFamily;
                measurer.style.fontSize = computed.fontSize;
                measurer.style.fontWeight = computed.fontWeight;

                // 1) Try widening first (up to cap).
                measurer.style.whiteSpace = "pre";
                measurer.style.width = "auto";
                measurer.textContent = (newValue ?? "").replaceAll("\u00A0", " ");
                const naturalWidth = Math.ceil(measurer.scrollWidth);
                const targetWidth = Math.min(AUTO_MAX_WIDTH, Math.max(width, naturalWidth));

                // 2) With that width, compute wrapped height.
                measurer.style.whiteSpace = "pre-wrap";
                measurer.style.width = `${targetWidth}px`;
                const wrappedHeight = Math.ceil(measurer.scrollHeight);

                const nextWidth = targetWidth > width + 1 ? targetWidth : undefined;
                const nextHeight = wrappedHeight > height + 1 ? wrappedHeight : undefined;

                updateValueAndSize(newValue, nextWidth, nextHeight);
            });
        };
    }, [height, updateValueAndSize, width]);

    const handleContentChange = (e: ContentEditableEvent) => {
        resizeToContent(e.target.value ?? "");
    }

    useEffect(() => {
        resizeToContent(value ?? "");
        return () => {
            if (measurerRef.current) {
                measurerRef.current.remove();
                measurerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <foreignObject x={x} y={y} width={width} height={height} onPointerDown={(e) => onPointerDown(e, id)}
        style={{outline: selectionColor ? `1px solid ${selectionColor}` : "none"}}>
            <ContentEditable
                html={value ?? ""}
                onChange={handleContentChange}
                innerRef={(el: HTMLElement | null) => {
                    contentRef.current = el;
                }}
                className={cn(
                    "w-full h-full px-2 py-2 text-center drop-shadow-md outline-none",
                    "whitespace-pre-wrap wrap-anywhere leading-snug",
                    font.className,
                )}
                style={{
                    color: fill ? colourToCSS(fill) : "#000000",
                    fontSize: fontSize ?? TEXT_FONT_SIZE,
                    fontFamily: fontFamily || undefined,
                    overflow: "hidden",
                }}
            />
        </foreignObject>
    )
}
