"use client";

import { InterpretationResult } from "../types";

interface TalismanCardProps {
    result: InterpretationResult;
}

export default function TalismanCard({ result }: TalismanCardProps) {
    return (
        <div className="bg-[#e8b646] p-4 rounded-sm shadow-inner relative h-full flex flex-col items-center justify-center overflow-hidden border-4 border-[#d4a024]">
            {/* Paper Texture */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Corner Characters */}
            <div className="absolute top-2 left-2 text-[#b02e0c] font-serif text-sm opacity-60">
                勅
            </div>
            <div className="absolute top-2 right-2 text-[#b02e0c] font-serif text-sm opacity-60">
                令
            </div>
            <div className="absolute bottom-2 left-2 text-[#b02e0c] font-serif text-sm opacity-60">
                禁
            </div>
            <div className="absolute bottom-2 right-2 text-[#b02e0c] font-serif text-sm opacity-60">
                急
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center w-full border-2 border-[#b02e0c] h-full flex flex-col items-center justify-center p-4 bg-[#f2c75c]/30">
                {/* Main Characters */}
                <div
                    className="text-[#b02e0c] text-5xl font-serif font-extrabold mb-4 tracking-widest animate-pulse"
                    style={{ writingMode: "vertical-rl" }}
                >
                    {result.talisman.name}
                </div>

                {/* Korean Name */}
                <div className="text-[#b02e0c] font-serif font-bold text-lg mb-2">
                    {result.talisman.korean}
                </div>

                {/* Description */}
                <p className="text-[#5d4037] text-[10px] font-medium opacity-80 leading-tight max-w-[150px]">
                    {result.talisman.description}
                </p>

                {/* Kummong Seal */}
                <div className="mt-4 w-12 h-12 rounded-full border-2 border-[#b02e0c] flex items-center justify-center text-[#b02e0c] text-xs font-bold opacity-80">
                    꾸몽
                </div>
            </div>
        </div>
    );
}
