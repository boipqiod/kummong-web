"use client";

import { Sparkles, Feather, BookOpen } from "lucide-react";
import { InterpretationResult } from "../types";

interface AnalysisCardProps {
    result: InterpretationResult;
}

export default function AnalysisCard({ result }: AnalysisCardProps) {
    const today = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <div className="bg-[#fffefc] border border-[#eaddcf] p-6 rounded-sm shadow-sm relative overflow-hidden h-full flex flex-col">
            {/* Inner border */}
            <div className="absolute top-2 bottom-2 left-2 right-2 border border-[#f5efe6] pointer-events-none rounded-sm" />

            <div className="relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-[#eaddcf] pb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#333]">
                            해몽 풀이
                        </span>
                        <span
                            className={`text-xs px-2 py-0.5 rounded font-bold ${result.gilHyung === "길몽"
                                ? "bg-green-100 text-green-700"
                                : result.gilHyung === "흉몽"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {result.gilHyung}
                        </span>
                    </div>
                    <span className="text-xs text-[#8d8d8d] font-serif">{today}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    {/* Title & Grade */}
                    <div className="text-center py-2">
                        <h3 className="text-2xl font-serif font-bold text-[#8b5a2b]">
                            {result.title}
                        </h3>
                        <p className="text-xs text-[#8d8d8d] mt-1">{result.grade} 길몽</p>
                    </div>

                    {/* Meaning */}
                    <div>
                        <h4 className="text-xs font-bold text-[#8b5a2b] mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> 꿈의 의미
                        </h4>
                        <p className="text-sm text-[#4a3b2a] leading-relaxed font-serif text-justify">
                            {result.meaning}
                        </p>
                    </div>

                    {/* Advice */}
                    <div>
                        <h4 className="text-xs font-bold text-[#8b5a2b] mb-1 flex items-center gap-1">
                            <Feather className="w-3 h-3" /> 지관의 조언
                        </h4>
                        <p className="text-sm text-[#4a3b2a] leading-relaxed font-serif text-justify">
                            {result.advice}
                        </p>
                    </div>

                    {/* Quote (지관의 비기) */}
                    {result.quote && (
                        <div className="bg-[#f9f5ec] border-l-2 border-[#8b5a2b] p-3 rounded-r-sm">
                            <h4 className="text-xs font-bold text-[#8b5a2b] mb-1 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> 지관의 비기
                            </h4>
                            <p className="text-xs text-[#5d4037] italic font-serif leading-relaxed">
                                &ldquo;{result.quote.text}&rdquo;
                            </p>
                            <p className="text-[9px] text-[#8d8d8d] mt-1 text-right">
                                ― {result.quote.source}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stamp */}
                <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-red-800 rounded-sm flex items-center justify-center opacity-40 rotate-[-12deg] pointer-events-none">
                    <span className="font-serif text-red-900 text-xs font-bold text-center leading-tight">
                        地官
                        <br />印
                    </span>
                </div>
            </div>
        </div>
    );
}
