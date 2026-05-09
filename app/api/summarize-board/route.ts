import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const PROMPT_FILE = path.join(process.cwd(), "board-summarizer-prompt.json");

const loadPrompt = (): string => {
    const raw = fs.readFileSync(PROMPT_FILE, "utf8");
    const config = JSON.parse(raw) as { prompt?: unknown };
    if (typeof config.prompt !== "string" || config.prompt.length === 0) {
        throw new Error(
            "'prompt' key missing or empty in board-summarizer-prompt.json",
        );
    }
    return config.prompt;
};

interface SummarizeRequestBody {
    image?: string;
}

interface GeminiPart {
    text?: string;
}

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: GeminiPart[];
        };
    }>;
    error?: {
        message?: string;
    };
}

export async function POST(request: Request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not configured on the server." },
            { status: 500 },
        );
    }

    let body: SummarizeRequestBody;
    try {
        body = (await request.json()) as SummarizeRequestBody;
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body." },
            { status: 400 },
        );
    }

    if (!body.image || typeof body.image !== "string") {
        return NextResponse.json(
            { error: "Request body must include an 'image' base64 string." },
            { status: 400 },
        );
    }

    const base64 = body.image.replace(/^data:image\/png;base64,/, "");

    let prompt: string;
    try {
        prompt = loadPrompt();
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to load prompt configuration.",
            },
            { status: 500 },
        );
    }

    let geminiResponse: Response;
    try {
        geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    inline_data: {
                                        mime_type: "image/png",
                                        data: base64,
                                    },
                                },
                                { text: prompt },
                            ],
                        },
                    ],
                }),
            },
        );
    } catch {
        return NextResponse.json(
            { error: "Could not reach the Gemini API." },
            { status: 502 },
        );
    }

    const data = (await geminiResponse.json().catch(() => null)) as
        | GeminiResponse
        | null;

    if (!geminiResponse.ok) {
        const message =
            data?.error?.message ??
            `Gemini API returned status ${geminiResponse.status}.`;
        return NextResponse.json(
            { error: message },
            { status: geminiResponse.status },
        );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
        return NextResponse.json(
            { error: "Gemini returned an empty summary." },
            { status: 502 },
        );
    }

    return NextResponse.json({ summary: text });
}
