import { TalismanCategory } from "./types";

// ───── 5-Layer Talisman Configuration ─────
// Layer 1: Base Background (category → gradient)
// Layer 2: Header Text (talisman name)
// Layer 3: Body Symbol (category → glyph)
// Layer 4: Side Decoration (grade → complexity)
// Layer 5: Bottom Seal (randomized stamp)

export interface TalismanTheme {
    gradient: string;
    borderColor: string;
    textColor: string;
    accentColor: string;
    sealColor: string;
}

export interface TalismanGlyph {
    character: string;
    label: string;
}

// ── Layer 1: Category → Base Theme ──
export const CATEGORY_THEMES: Record<TalismanCategory, TalismanTheme> = {
    wealth: {
        gradient: "linear-gradient(135deg, #f6d365 0%, #e8b646 40%, #d4a024 100%)",
        borderColor: "#b8860b",
        textColor: "#7c2d12",
        accentColor: "#d97706",
        sealColor: "#b02e0c",
    },
    health: {
        gradient: "linear-gradient(135deg, #a8e6cf 0%, #7bc89c 40%, #56ab7b 100%)",
        borderColor: "#2d6a4f",
        textColor: "#1b4332",
        accentColor: "#40916c",
        sealColor: "#2d6a4f",
    },
    relationship: {
        gradient: "linear-gradient(135deg, #fbc2eb 0%, #e8a0c9 40%, #d685ad 100%)",
        borderColor: "#9d4375",
        textColor: "#701a54",
        accentColor: "#c26d9b",
        sealColor: "#9d174d",
    },
    career: {
        gradient: "linear-gradient(135deg, #a8c0ff 0%, #8ba4e8 40%, #6f89d4 100%)",
        borderColor: "#3b5998",
        textColor: "#1e3a5f",
        accentColor: "#5b7fc4",
        sealColor: "#1e40af",
    },
    protection: {
        gradient: "linear-gradient(135deg, #c9b1ff 0%, #a78bfa 40%, #8b72e8 100%)",
        borderColor: "#5b21b6",
        textColor: "#3b0764",
        accentColor: "#7c3aed",
        sealColor: "#4c1d95",
    },
};

// ── Layer 3: Category → Body Symbols ──
const CATEGORY_GLYPHS: Record<TalismanCategory, TalismanGlyph[]> = {
    wealth: [
        { character: "財", label: "재물" },
        { character: "福", label: "복" },
        { character: "祿", label: "녹봉" },
    ],
    health: [
        { character: "壽", label: "장수" },
        { character: "康", label: "건강" },
        { character: "安", label: "안녕" },
    ],
    relationship: [
        { character: "緣", label: "인연" },
        { character: "和", label: "화합" },
        { character: "愛", label: "사랑" },
    ],
    career: [
        { character: "成", label: "성공" },
        { character: "達", label: "달성" },
        { character: "昇", label: "승진" },
    ],
    protection: [
        { character: "守", label: "수호" },
        { character: "避", label: "비앙" },
        { character: "鎮", label: "진압" },
    ],
};

// ── Layer 4: Grade → Border Decorations ──
export type BorderComplexity = "simple" | "medium" | "ornate";

export function getGradeComplexity(grade: string | number | undefined | null): BorderComplexity {
    if (!grade) return "simple";
    const gradeStr = typeof grade === "string" ? grade : String(grade);
    const num = parseInt(gradeStr.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) return "simple";
    if (num <= 10) return "ornate";
    if (num <= 30) return "medium";
    return "simple";
}

export const BORDER_PATTERNS: Record<BorderComplexity, { width: number; style: string }> = {
    simple: { width: 2, style: "solid" },
    medium: { width: 3, style: "double" },
    ornate: { width: 4, style: "double" },
};

// ── Layer 5: Seals ──
const SEALS = ["印", "信", "驗", "眞", "靈"];

// ── Corner Characters ──
const CORNER_SETS = [
    ["天", "地", "人", "和"],
    ["吉", "祥", "如", "意"],
    ["福", "壽", "康", "寧"],
    ["日", "月", "星", "辰"],
];

// ── Deterministic RNG (무작위 but consistent per name) ──
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

// ── Sentiment → Saturation/Brightness modifier ──
export function getSentimentModifier(sentiment: number): { saturation: number; brightness: number } {
    // 0(흉) → desaturated/darker, 10(길) → vibrant/brighter
    const normalized = Math.max(0, Math.min(10, sentiment)) / 10;
    return {
        saturation: 0.6 + normalized * 0.4, // 60%~100%
        brightness: 0.85 + normalized * 0.15, // 85%~100%
    };
}

// ── Main Config Generator ──
export function generateTalismanConfig(talisman: {
    name: string;
    korean: string;
    description: string;
    category?: TalismanCategory;
    sentiment?: number;
} | undefined | null, grade: string | number | undefined | null) {
    if (!talisman) {
        return {
            theme: CATEGORY_THEMES.protection,
            bodyGlyph: CATEGORY_GLYPHS.protection[0],
            complexity: "simple" as BorderComplexity,
            border: BORDER_PATTERNS.simple,
            seal: SEALS[0],
            corners: CORNER_SETS[0],
            sentimentMod: getSentimentModifier(5),
            category: "protection" as TalismanCategory,
            sentiment: 5,
        };
    }

    const category = talisman.category || "protection";
    const sentiment = talisman.sentiment ?? 5;
    const hash = hashCode((talisman.name || "") + (talisman.korean || ""));

    const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.protection;
    const glyphs = CATEGORY_GLYPHS[category];
    const bodyGlyph = glyphs[hash % glyphs.length];
    const complexity = getGradeComplexity(grade);
    const border = BORDER_PATTERNS[complexity];
    const seal = SEALS[hash % SEALS.length];
    const corners = CORNER_SETS[hash % CORNER_SETS.length];
    const sentimentMod = getSentimentModifier(sentiment);

    return {
        theme,
        bodyGlyph,
        complexity,
        border,
        seal,
        corners,
        sentimentMod,
        category,
        sentiment,
    };
}
