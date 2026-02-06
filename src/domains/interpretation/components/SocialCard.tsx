"use client";

import { Sparkles } from "lucide-react";
import { InterpretationResult } from "../types";

interface SocialCardProps {
    result: InterpretationResult;
}

export default function SocialCard({ result }: SocialCardProps) {
    return (
        <div className="bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] p-6 rounded-xl shadow-xl h-full flex flex-col relative overflow-hidden text-white">
            {/* Decorative Blurs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>

                {/* Title */}
                <div>
                    <div className="text-yellow-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">
                        Dream Interpretation
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-1">{result.title}</h2>
                    <p className="text-white/60 text-xs">{result.grade}</p>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/20 my-2" />

                {/* Summary */}
                <p className="text-sm font-light leading-relaxed text-white/90">
                    {result.socialSummary}
                </p>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-auto pt-4 flex justify-between items-end">
                <span className="text-[10px] text-white/40 font-serif">Kummong AI</span>
                <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-serif font-bold text-xs">
                    夢
                </div>
            </div>
        </div>
    );
}
