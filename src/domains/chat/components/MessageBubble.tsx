"use client";

import { Sparkles, ChevronRight, Info } from "lucide-react";
import { Message } from "../types";

interface MessageBubbleProps {
    message: Message;
    onActionClick?: () => void;
}

export default function MessageBubble({ message, onActionClick }: MessageBubbleProps) {
    if (message.role === "user") {
        return (
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-[80%] bg-[#3d3d3d] text-[#f7f5ef] px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-[15px] font-medium leading-relaxed border border-[#2b2b2b]">
                    {message.content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-full max-w-[95%] relative group">
                {/* Avatar */}
                <div className="absolute -left-1 -top-3 w-8 h-8 rounded-full bg-[#2b2b2b] border-2 border-[#8b5a2b] flex items-center justify-center z-20 shadow-md">
                    <span className="font-serif text-[#f7f5ef] text-xs font-bold">夢</span>
                </div>

                {/* Message Card */}
                <div className="bg-[#fffefc] border border-[#eaddcf] p-6 rounded-sm shadow-sm relative overflow-hidden ml-2">
                    {/* Inner Border */}
                    <div className="absolute top-2 bottom-2 left-2 right-2 border border-[#f5efe6] pointer-events-none rounded-sm" />

                    {/* Content */}
                    <p className="font-serif text-[#4a3b2a] text-[17px] leading-relaxed whitespace-pre-wrap relative z-10">
                        {message.content}
                    </p>

                    {/* Action Button */}
                    {message.type === "action" && onActionClick && (
                        <div className="mt-6 relative z-10">
                            <button
                                onClick={onActionClick}
                                className="w-full bg-[#8b5a2b] text-[#f7f5ef] py-3.5 rounded shadow-lg hover:bg-[#6d4521] transition-all flex items-center justify-center gap-2 group/btn border border-[#5d3a1a]"
                            >
                                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                                <span className="font-serif font-bold tracking-wide">
                                    {message.actionLabel}
                                </span>
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-[10px] text-[#a8a29e] mt-2 font-serif flex items-center justify-center gap-1">
                                <Info className="w-3 h-3" /> 잠시 기다리시면 결과가 공개됩니다.
                            </p>
                        </div>
                    )}

                    {/* Stamp */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 rotate-[-15deg] border-2 border-red-800 rounded-sm flex items-center justify-center pointer-events-none">
                        <span className="font-serif text-red-800 text-xs">地官</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
