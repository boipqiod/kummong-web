"use client";

import { useState, useEffect } from "react";

const LOADING_PHASES = [
    {
        message: "꿈의 기운을 살피고 있습니다...",
        subMessage: "천기(天氣)를 읽는 중",
        icon: "🌙",
    },
    {
        message: "옛 문헌을 뒤적이고 있습니다...",
        subMessage: "해몽비결(解夢秘訣) 조회 중",
        icon: "📜",
    },
    {
        message: "부적을 써내려가고 있습니다...",
        subMessage: "신기(神氣)를 모으는 중",
        icon: "✨",
    },
];

interface InterpretationLoadingProps {
    onComplete?: () => void;
}

export default function InterpretationLoading({ onComplete }: InterpretationLoadingProps) {
    const [phase, setPhase] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        if (phase >= LOADING_PHASES.length) {
            onComplete?.();
            return;
        }

        // Fade-in on phase change
        setFadeIn(true);

        const timer = setTimeout(() => {
            // Fade-out before next phase
            setFadeIn(false);
            setTimeout(() => {
                setPhase((p) => p + 1);
            }, 300);
        }, 1500);

        return () => clearTimeout(timer);
    }, [phase, onComplete]);

    const currentPhase = LOADING_PHASES[Math.min(phase, LOADING_PHASES.length - 1)];

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center gap-6">
            {/* Pulsing ring animation */}
            <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#8b5a2b] animate-ping opacity-30" />
                <div className="absolute inset-2 rounded-full border-2 border-[#d4a024] animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-3xl z-10 animate-pulse">{currentPhase.icon}</span>
            </div>

            {/* Message */}
            <div
                className="text-center transition-all duration-300"
                style={{
                    opacity: fadeIn ? 1 : 0,
                    transform: fadeIn ? "translateY(0)" : "translateY(8px)",
                }}
            >
                <p className="text-[#f7f5ef] font-serif text-lg mb-2">
                    {currentPhase.message}
                </p>
                <p className="text-[#8d8d8d] text-xs">
                    {currentPhase.subMessage}
                </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-4">
                {LOADING_PHASES.map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i <= phase ? "#d4a024" : "#555",
                            transform: i === phase ? "scale(1.3)" : "scale(1)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
