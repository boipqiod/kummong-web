"use client";

import { useState } from "react";
import { ScrollText, CheckSquare, Square } from "lucide-react";

interface DisclaimerModalProps {
    onAccept: () => void;
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-[2px]">
            <div className="w-full max-w-sm bg-[#fdfbf7] rounded-sm overflow-hidden shadow-2xl relative border-2 border-[#8b5a2b] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-[#f5f0e6] p-6 pb-4 text-center border-b border-[#eaddcf]">
                    <ScrollText className="w-8 h-8 text-[#8b5a2b] mx-auto mb-2 opacity-80" />
                    <h2 className="text-xl font-serif font-bold text-[#4a3b2a] tracking-widest">
                        지관의 당부
                    </h2>
                    <p className="text-xs text-[#8d8d8d] mt-1">Geomancer&apos;s Request</p>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 space-y-5">
                    <p className="text-sm text-[#5d4037] leading-relaxed font-serif text-center font-bold">
                        &quot;해몽은 삶의 지혜일 뿐, 현실의 선택은 그대의 몫임을 명심하시게.&quot;
                    </p>

                    <div className="bg-[#f5f0e6] rounded p-3 text-xs text-[#5d4037] leading-relaxed">
                        <p>• 본 서비스는 전통 해몽을 AI로 재해석한 <strong>오락용 콘텐츠</strong>입니다.</p>
                        <p className="mt-1">• 의학적·법적·재정적 결정의 근거로 사용하지 마십시오.</p>
                        <p className="mt-1">• 결과에 대한 책임은 전적으로 본인에게 있습니다.</p>
                    </div>

                    {/* Checkbox */}
                    <button
                        onClick={() => setAgreed(!agreed)}
                        className="flex items-center gap-3 w-full p-2 hover:bg-[#8b5a2b]/5 rounded cursor-pointer group transition-colors"
                    >
                        {agreed ? (
                            <CheckSquare className="w-5 h-5 text-[#8b5a2b]" />
                        ) : (
                            <Square className="w-5 h-5 text-[#a8a29e]" />
                        )}
                        <span
                            className={`text-xs font-serif ${agreed ? "text-[#8b5a2b] font-bold" : "text-[#8d8d8d]"
                                }`}
                        >
                            위 내용을 이해하고 동의합니다.
                        </span>
                    </button>

                    {/* Enter Button */}
                    <button
                        onClick={() => agreed && onAccept()}
                        disabled={!agreed}
                        className={`w-full py-3.5 rounded-sm font-serif font-bold tracking-[0.2em] transition-all border ${agreed
                                ? "bg-[#2b2b2b] text-[#f7f5ef] hover:bg-[#404040] border-transparent"
                                : "bg-[#eaddcf] text-[#cbbba9] cursor-not-allowed border-transparent"
                            }`}
                    >
                        입장하기
                    </button>
                </div>
            </div>
        </div>
    );
}
