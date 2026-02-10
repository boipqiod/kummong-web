import { NextRequest, NextResponse } from "next/server";
import { chat, generateInterpretation, ChatMessage } from "@/infrastructure/ai/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, userMessage, action, evidence } = body;

        if (action === "interpret") {
            // Generate final interpretation with evidence
            const conversationSummary = messages
                .map((m: ChatMessage) => `${m.role === "user" ? "사용자" : "지관"}: ${m.parts[0].text}`)
                .join("\n");

            const result = await generateInterpretation(conversationSummary, evidence);
            return NextResponse.json({ interpretation: result });
        }

        // Regular chat — returns message + snippets
        const response = await chat(messages, userMessage);
        return NextResponse.json({
            message: response.message,
            snippets: response.snippets,
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "채팅 처리 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
