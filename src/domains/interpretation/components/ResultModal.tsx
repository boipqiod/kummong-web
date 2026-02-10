import { X } from "lucide-react";
import { InterpretationResult } from "../types";
import AnalysisCard from "./AnalysisCard";

interface ResultModalProps {
    result: InterpretationResult;
    onClose: () => void;
}

export default function ResultModal({ result, onClose }: ResultModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-2xl bg-[#fdfbf7] rounded-sm shadow-2xl relative border-2 border-[#d6c4b0] max-h-[90vh] flex flex-col overflow-hidden">
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

                {/* Content Area */}
                <div className="flex-1 p-4 bg-[#fdfbf7] overflow-y-auto relative scrollbar-thin scrollbar-thumb-[#d6c4b0] scrollbar-track-transparent">
                    <div className="w-full bg-[#fdfbf7]">
                        <AnalysisCard result={result} />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#f5f0e6] border-t border-[#d6c4b0] shrink-0">
                    <div className="text-[10px] text-[#a8a29e] text-center leading-tight">
                        AI-Generated Content: 실제와 다를 수 있으니 맹신하지 마십시오.
                    </div>
                </div>
            </div>
        </div>
    );
}
