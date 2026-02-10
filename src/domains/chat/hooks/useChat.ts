"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Message } from "../types";
import { getRandomGreeting } from "../greetings";

interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "initial",
            role: "assistant",
            content: "",
            type: "text",
        },
    ]);

    useEffect(() => {
        setMessages((prev) => {
            if (prev[0].id === "initial" && !prev[0].content) {
                return [
                    {
                        ...prev[0],
                        content: getRandomGreeting(),
                    },
                    ...prev.slice(1),
                ];
            }
            return prev;
        });
    }, []);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadyForResult, setIsReadyForResult] = useState(false);
    const historyRef = useRef<ChatMessage[]>([]);
    const snippetsRef = useRef<string[]>([]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content.trim(),
            type: "text",
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: historyRef.current,
                    userMessage: content.trim(),
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // 스니펫 누적
            if (data.snippets && data.snippets.length > 0) {
                snippetsRef.current = [...snippetsRef.current, ...data.snippets];
                console.log(`[useChat] Accumulated ${snippetsRef.current.length} snippets total.`);
            }

            // Update history
            historyRef.current = [
                ...historyRef.current,
                { role: "user", parts: [{ text: content.trim() }] },
                { role: "model", parts: [{ text: data.message }] },
            ];

            // Check if ready for interpretation
            const isReady = data.message.includes("[해몽준비완료]");

            // Remove [해몽준비완료] tag from display, keep AI's original message as-is
            const displayMessage = data.message.replace("[해몽준비완료]", "").trim();

            const modelMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: displayMessage,
                type: isReady ? "action" : "text",
                actionLabel: isReady ? "무료로 결과 확인하기" : undefined,
            };

            setMessages((prev) => [...prev, modelMsg]);

            if (isReady) {
                setIsReadyForResult(true);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요.",
                type: "text",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const getConversationHistory = useCallback(() => {
        return historyRef.current;
    }, []);

    /**
     * 누적된 스니펫을 evidence 문자열로 반환
     */
    const getEvidence = useCallback((): string => {
        if (snippetsRef.current.length === 0) return '';
        // 중복 제거 후 반환
        const unique = [...new Set(snippetsRef.current)];
        return unique.join('\n');
    }, []);

    return {
        messages,
        isLoading,
        isReadyForResult,
        sendMessage,
        getConversationHistory,
        getEvidence,
    };
}
