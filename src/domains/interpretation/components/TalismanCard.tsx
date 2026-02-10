"use client";

import { InterpretationResult } from "../types";
import { generateTalismanConfig } from "../talismanConfig";

interface TalismanCardProps {
    result: InterpretationResult;
}

export default function TalismanCard({ result }: TalismanCardProps) {
    const config = generateTalismanConfig(result.talisman, result.grade);
    const { theme, bodyGlyph, border, seal, corners, sentimentMod, complexity } = config;

    // Sentiment-adjusted filter
    const filterStyle = {
        filter: `saturate(${sentimentMod.saturation}) brightness(${sentimentMod.brightness})`,
    };

    return (
        <div
            className="relative rounded-sm shadow-inner h-full flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: theme.gradient,
                padding: "16px",
                ...filterStyle,
            }}
        >
            {/* Layer 1: Paper Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Layer 4: Decorative Border */}
            <div
                className="absolute inset-2 pointer-events-none"
                style={{
                    border: `${border.width}px ${border.style} ${theme.borderColor}`,
                }}
            >
                {/* Ornate: inner border line */}
                {complexity === "ornate" && (
                    <div
                        className="absolute inset-1"
                        style={{ border: `1px solid ${theme.borderColor}40` }}
                    />
                )}
            </div>

            {/* Layer 4: Corner Characters */}
            <div className="absolute top-4 left-4 text-xl font-serif font-bold opacity-60" style={{ color: theme.textColor }}>
                {corners[0]}
            </div>
            <div className="absolute top-4 right-4 text-xl font-serif font-bold opacity-60" style={{ color: theme.textColor }}>
                {corners[1]}
            </div>
            <div className="absolute bottom-4 left-4 text-xl font-serif font-bold opacity-60" style={{ color: theme.textColor }}>
                {corners[2]}
            </div>
            <div className="absolute bottom-4 right-4 text-xl font-serif font-bold opacity-60" style={{ color: theme.textColor }}>
                {corners[3]}
            </div>

            {/* Layer 2 & 3: Main Content */}
            <div className="relative z-10 text-center w-full h-full flex flex-col items-center justify-center p-6 gap-4">

                {/* Layer 3: Body Symbol */}
                <div
                    className="text-7xl font-serif font-extrabold opacity-20 absolute"
                    style={{ color: theme.textColor }}
                >
                    {bodyGlyph.character}
                </div>

                {/* Layer 2: Header — Talisman Name */}
                <div
                    className="text-4xl font-serif font-extrabold tracking-[0.3em] animate-pulse"
                    style={{
                        color: theme.textColor,
                        writingMode: "vertical-rl",
                    }}
                >
                    {result.talisman.name}
                </div>

                {/* Korean Name */}
                <div
                    className="font-serif font-bold text-lg"
                    style={{ color: theme.textColor }}
                >
                    {result.talisman.korean}
                </div>

                {/* Description */}
                <p
                    className="text-[10px] leading-relaxed max-w-[200px] opacity-80"
                    style={{ color: theme.textColor }}
                >
                    {result.talisman.description}
                </p>

                {/* Layer 5: Seal Stamp */}
                <div className="mt-2 relative">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 rotate-[-8deg]"
                        style={{
                            borderColor: theme.sealColor,
                            color: theme.sealColor,
                        }}
                    >
                        <span className="text-xl font-serif font-bold">{seal}</span>
                    </div>
                    <div className="text-[8px] mt-1 text-center opacity-60" style={{ color: theme.textColor }}>
                        꾸몽인
                    </div>
                </div>
            </div>
        </div>
    );
}
