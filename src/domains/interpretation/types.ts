export interface InterpretationResult {
    title: string;
    grade: string;
    gilHyung: "길몽" | "흉몽" | "중립";
    meaning: string;
    advice: string;
    talisman: {
        name: string;
        korean: string;
        description: string;
        category?: TalismanCategory;
        sentiment?: number; // 0~10
    };
    quote?: {
        source: string;
        text: string;
    };
    socialSummary: string;
}

export type TalismanCategory = "wealth" | "health" | "relationship" | "career" | "protection";

export type ResultTabType = "ANALYSIS" | "TALISMAN" | "SOCIAL";
