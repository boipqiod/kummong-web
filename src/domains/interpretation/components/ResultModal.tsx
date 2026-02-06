"use client";

import { useState, useRef } from "react";
import { X, Download, Share2, ScrollText, Shield, LayoutTemplate } from "lucide-react";
import { InterpretationResult, ResultTabType } from "../types";
import AnalysisCard from "./AnalysisCard";
import TalismanCard from "./TalismanCard";
import SocialCard from "./SocialCard";

interface ResultModalProps {
    result: InterpretationResult;
    onClose: () => void;
}

export default function ResultModal({ result, onClose }: ResultModalProps) {
    const [activeTab, setActiveTab] = useState<ResultTabType>("ANALYSIS");
    const cardRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!cardRef.current) return;

        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
            } as Parameters<typeof html2canvas>[1]);

            const link = document.createElement("a");
            link.download = `kummong-${activeTab.toLowerCase()}-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Image save error:", error);
            alert("이미지 저장 중 오류가 발생했습니다.");
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `꾸몽 해몽 결과: ${result.title}`,
            text: result.socialSummary,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(
                    `${shareData.title}\n${shareData.text}\n${shareData.url}`
                );
                alert("클립보드에 복사되었습니다!");
            }
        } catch (error) {
            console.error("Share error:", error);
        }
    };

    const tabs = [
        { id: "ANALYSIS" as const, label: "정석 풀이", icon: ScrollText },
        { id: "TALISMAN" as const, label: "디지털 부적", icon: Shield },
        { id: "SOCIAL" as const, label: "공유용 카드", icon: LayoutTemplate },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-sm bg-[#fdfbf7] rounded-sm shadow-2xl relative border-2 border-[#d6c4b0] h-[600px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#2b2b2b] p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#2b2b2b] font-serif font-bold">
                            夢
                        </div>
                        <h2 className="text-[#f7f5ef] font-serif font-bold text-lg tracking-widest">
                            해몽 결과
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#f7f5ef] hover:opacity-70 transition-opacity"
                        aria-label="닫기"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#d6c4b0] bg-[#f5f0e6] shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-xs font-bold font-serif flex items-center justify-center gap-1 transition-colors ${activeTab === tab.id
                                ? "bg-[#fdfbf7] text-[#8b5a2b] border-b-2 border-[#8b5a2b]"
                                : "text-[#8d8d8d] hover:bg-[#eaddcf]"
                                }`}
                        >
                            <tab.icon className="w-3 h-3" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 bg-[#fdfbf7] overflow-y-auto relative scrollbar-thin scrollbar-thumb-[#d6c4b0] scrollbar-track-transparent">
                    <div ref={cardRef} className="w-full bg-[#fdfbf7]">
                        {activeTab === "ANALYSIS" && <AnalysisCard result={result} />}
                        {activeTab === "TALISMAN" && <TalismanCard result={result} />}
                        {activeTab === "SOCIAL" && <SocialCard result={result} />}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#f5f0e6] border-t border-[#d6c4b0] shrink-0 space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveImage}
                            className="flex-1 bg-[#2b2b2b] text-[#f7f5ef] py-3 rounded-sm text-sm font-bold shadow-md hover:bg-[#404040] flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            이미지 저장
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 bg-white text-[#333] py-3 rounded-sm text-sm font-bold border border-[#d6c4b0] hover:bg-[#fffefc] flex items-center justify-center gap-2 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            공유하기
                        </button>
                    </div>
                    <div className="text-[9px] text-[#a8a29e] text-center leading-tight">
                        AI-Generated Content: 실제와 다를 수 있으니 맹신하지 마십시오.
                    </div>
                </div>
            </div>
        </div>
    );
}
