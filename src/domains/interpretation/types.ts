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
    };
    socialSummary: string;
}

export type ResultTabType = "ANALYSIS" | "TALISMAN" | "SOCIAL";
