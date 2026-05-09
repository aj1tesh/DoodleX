"use client";

import { useCallback, useState } from "react";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { toast } from "sonner";

import { ToolButton } from "./tool-button";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const SUMMARIZE_ENDPOINT = "/api/summarize-board";

const captureBoardScreenshot = async (): Promise<string> => {
    const target = document.querySelector<HTMLElement>("[data-board-canvas]");
    if (!target) {
        throw new Error("Could not find the board canvas element.");
    }

    const canvas = await html2canvas(target, {
        backgroundColor: "#f5f5f5",
        useCORS: true,
        logging: false,
        ignoreElements: (el) => {
            const parent = el.parentElement;
            if (
                parent &&
                parent.hasAttribute("data-board-canvas") &&
                el.tagName.toLowerCase() !== "svg"
            ) {
                return true;
            }
            return false;
        },
    });

    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl.replace(/^data:image\/png;base64,/, "");
};

const requestSummary = async (base64Image: string): Promise<string> => {
    let response: Response;
    try {
        response = await fetch(SUMMARIZE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
        });
    } catch {
        throw new Error(
            "Could not reach the summarization service. Please check your connection and try again."
        );
    }

    const data = (await response
        .json()
        .catch(() => null)) as { summary?: string; error?: string } | null;

    if (!response.ok) {
        throw new Error(
            data?.error ?? `Summarization failed with status ${response.status}.`
        );
    }

    const summary = data?.summary?.trim();
    if (!summary) {
        throw new Error("The summarization service returned an empty summary.");
    }
    return summary;
};

export const BoardSummarizer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runSummarize = useCallback(async () => {
        setIsLoading(true);
        setSummary(null);
        setError(null);

        try {
            const base64 = await captureBoardScreenshot();
            const result = await requestSummary(base64);
            setSummary(result);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred while summarizing the board.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleClick = useCallback(() => {
        if (isLoading) return;
        setIsOpen(true);
        if (!document.querySelector("[data-board-canvas]")) {
            toast.error("Could not find the board canvas.");
            return;
        }
        runSummarize();
    }, [isLoading, runSummarize]);

    return (
        <>
            <ToolButton
                icon={SparklesIcon}
                label="Summarize Board"
                onClick={handleClick}
                isDisabled={isLoading}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-2xl flex flex-col max-h-[85vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <SparklesIcon className="size-5" />
                            Board Summary
                        </DialogTitle>
                        <DialogDescription>
                            AI-generated overview of the content currently on
                            your whiteboard.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto py-2">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                                <Loader2Icon className="size-6 animate-spin" />
                                <p className="text-sm">
                                    Analysing your board with Ollama…
                                </p>
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                                <p className="font-semibold mb-1">
                                    Couldn&apos;t generate a summary
                                </p>
                                <p className="leading-relaxed">{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && summary && (
                            <div className="rounded-md border bg-neutral-50 p-4 text-sm whitespace-pre-wrap leading-relaxed text-neutral-800">
                                {summary}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={runSummarize}
                            disabled={isLoading}
                        >
                            {error ? "Try again" : "Re-summarize"}
                        </Button>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
