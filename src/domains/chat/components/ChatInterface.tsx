"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Feather, Sparkles, ChevronRight, Info } from "lucide-react";
import { Message } from "../types";
import MessageBubble from "./MessageBubble";

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
    onShowResult: () => void;
}

// Extended Window interface for Web Speech API
interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start(): void;
    stop(): void;
}

declare global {
    interface Window {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
    }
}

export default function ChatInterface({
    messages,
    isLoading,
    onSendMessage,
    onShowResult,
}: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isListening]);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognitionClass =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognitionClass) {
                const recognition = new SpeechRecognitionClass();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = "ko-KR";

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = Array.from(event.results)
                        .map((result) => result[0])
                        .map((result) => result.transcript)
                        .join("");
                    setInput(transcript);
                };

                recognition.onend = () => setIsListening(false);
                recognition.onerror = () => setIsListening(false);
                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            setInput("");
        }
    };

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f7f5ef]">
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative z-10 space-y-6">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onActionClick={msg.type === "action" ? onShowResult : undefined}
                        />
                    ))}

                    {isLoading && (
                        <div className="flex justify-center">
                            <div className="bg-[#8b5a2b]/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <span className="w-2 h-2 bg-[#8b5a2b] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-[#8b5a2b] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-[#8b5a2b] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                                <span className="text-sm text-[#5d4037] font-serif">생각 중...</span>
                            </div>
                        </div>
                    )}

                    {isListening && (
                        <div className="flex justify-center py-4">
                            <div className="bg-[#8b5a2b] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-pulse border border-[#6d4521]">
                                <Mic className="w-5 h-5" />
                                <span className="text-sm font-medium font-serif tracking-wide">
                                    듣고 있습니다...
                                </span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </main>

            {/* Input Area */}
            <footer className="bg-[#e6dfd1] px-4 py-4 border-t border-[#d6c4b0] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div
                    className={`flex items-center gap-2 rounded-xl px-2 py-2 transition-all ${isListening
                            ? "bg-[#8b5a2b]/10 border border-[#8b5a2b]"
                            : "bg-[#fdfbf7] border border-[#d6c4b0] focus-within:border-[#8b5a2b]"
                        }`}
                >
                    <button
                        onClick={toggleListening}
                        className={`p-2.5 rounded-lg transition-all flex-shrink-0 ${isListening
                                ? "text-red-600 bg-red-50 animate-pulse"
                                : "text-[#8b5a2b] hover:bg-[#8b5a2b]/10"
                            }`}
                        aria-label={isListening ? "음성 입력 중지" : "음성 입력 시작"}
                    >
                        {isListening ? (
                            <MicOff className="w-5 h-5" />
                        ) : (
                            <Mic className="w-5 h-5" />
                        )}
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "..." : "꿈 내용을 적어주십시오..."}
                        disabled={isListening || isLoading}
                        className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[#333] placeholder-[#9ca3af] px-2 text-[15px] font-medium h-10"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isListening || isLoading}
                        className={`p-2.5 rounded-lg transition-all flex-shrink-0 ${input.trim() && !isListening && !isLoading
                                ? "bg-[#2b2b2b] text-[#f7f5ef] shadow-md hover:bg-[#404040]"
                                : "bg-[#eaddcf] text-[#cbbba9] cursor-not-allowed"
                            }`}
                        aria-label="메시지 전송"
                    >
                        <Feather className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
