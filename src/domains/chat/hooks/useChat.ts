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

            // Update history
            historyRef.current = [
                ...historyRef.current,
                { role: "user", parts: [{ text: content.trim() }] },
                { role: "model", parts: [{ text: data.message }] },
            ];

            // Check if ready for interpretation
            const isReady = data.message.includes("[해몽준비완료]");
            const cleanMessage = data.message.replace("[해몽준비완료]", "").trim();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: cleanMessage,
                type: "text",
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (isReady) {
                setIsReadyForResult(true);
                // Add action message
                setTimeout(() => {
                    const actionMessage: Message = {
                        id: (Date.now() + 2).toString(),
                        role: "assistant",
                        content: "해몽 결과를 확인할 준비가 되었습니다.",
                        type: "action",
                        actionLabel: "무료로 결과 확인하기",
                    };
                    setMessages((prev) => [...prev, actionMessage]);
                }, 800);
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

    return {
        messages,
        isLoading,
        isReadyForResult,
        sendMessage,
        getConversationHistory,
    };
}
