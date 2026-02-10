import { GoogleGenAI } from "@google/genai";
import { JIGWAN_SYSTEM_PROMPT, NORMALIZATION_PROMPT, INTERPRETATION_PROMPT } from "./prompts";
import { DreamSymbolRepository } from "../../domains/interpretation/DreamSymbolRepository";

// Initialize the Gemini client
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY not found. Using mock responses.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export interface ChatResponse {
    message: string;
    snippets: string[];
}

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
        category: "wealth" | "health" | "relationship" | "career" | "protection";
        sentiment: number;
    };
    quote?: {
        source: string;
        text: string;
    };
    socialSummary: string;
}

// Mock responses for when API key is not available
const MOCK_RESPONSES = [
    "흠... 흥미로운 꿈이로군요. 그 꿈에서 어떤 감정을 느끼셨습니까?",
    "그러하오. 주변에 다른 사람이나 동물이 있었습니까?",
    "알겠소. 그 장소의 분위기는 어떠했습니까? 밝았소, 어두웠소?",
    "점점 윤곽이 드러나는구려. 그 꿈이 일어난 시간대가 기억나시오?",
    "충분히 들었소. 이제 그 뜻을 풀어드릴 준비가 되었소. [해몽준비완료]",
];

let mockIndex = 0;

const tools = [
    {
        functionDeclarations: [
            {
                name: "searchDreamSymbol",
                description: "꿈에 등장한 사물, 동물, 현상 등의 해몽 정보를 검색합니다. 사용자가 꿈 내용을 말하면 핵심 키워드를 추출하여 이 도구를 사용하세요.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        keyword: {
                            type: "STRING",
                            description: "검색할 꿈의 핵심 키워드 (예: 돼지, 이빨, 똥)",
                        },
                    },
                    required: ["keyword"],
                },
            },
            {
                name: "normalizeDreamSymbol",
                description: "현대적 사물(비트코인, 스마트폰 등)을 전통 해몽 상징어로 변환합니다. 매핑 테이블에 없는 현대어를 만났을 때 사용하세요.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        keyword: {
                            type: "STRING",
                            description: "변환할 현대적 키워드 (예: 비트코인, 엘리베이터)",
                        },
                        emotion: {
                            type: "STRING",
                            description: "사용자가 느낀 감정 (예: 두려움, 기쁨, 불안)",
                        },
                    },
                    required: ["keyword"],
                },
            },
        ],
    } as any,
];

/**
 * AI Fallback: 매핑 테이블에 없는 현대어를 AI로 변환
 */
async function normalizeViaAI(
    client: GoogleGenAI,
    keyword: string,
    emotion?: string
): Promise<string[]> {
    try {
        const prompt = `${NORMALIZATION_PROMPT}\n\n현대어: ${keyword}${emotion ? `\n감정: ${emotion}` : ''}`;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log(`[AI Normalization] "${keyword}" → "${parsed.symbol}" (${parsed.reason})`);
            return [parsed.symbol];
        }
    } catch (error) {
        console.error("[AI Normalization] Failed:", error);
    }

    return [keyword]; // fallback: 원래 키워드 반환
}

export async function chat(
    messages: ChatMessage[],
    userMessage: string
): Promise<ChatResponse> {
    const client = getGeminiClient();
    const collectedSnippets: string[] = [];

    if (!client) {
        // Return mock response
        const response = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
        mockIndex++;
        return { message: response, snippets: [] };
    }

    try {
        // 데이터 리포지토리 초기화 (최초 1회 로딩)
        await DreamSymbolRepository.initialize();

        const chatSession = client.chats.create({
            model: "gemini-2.5-flash",
            // @ts-ignore
            config: {
                systemInstruction: JIGWAN_SYSTEM_PROMPT,
                tools: tools,
            },
            history: messages,
        });

        // Send User Message
        let result = await chatSession.sendMessage({
            message: userMessage,
        } as any);

        // Function Calling Loop — 최대 3회까지 연속 도구 호출 허용
        let loopCount = 0;
        while (result.functionCalls && result.functionCalls.length > 0 && loopCount < 3) {
            loopCount++;
            const call = result.functionCalls[0];

            if (call.name === "searchDreamSymbol") {
                const { keyword } = call.args as { keyword: string };
                console.log(`[FunctionCalling] Searching for symbol: ${keyword}`);

                const searchResults = DreamSymbolRepository.search(keyword);
                const snippets = DreamSymbolRepository.toSnippets(searchResults);
                collectedSnippets.push(...snippets);

                const formattedResults = searchResults.length > 0
                    ? {
                        found: true,
                        count: searchResults.length,
                        items: snippets
                    }
                    : {
                        found: false,
                        count: 0,
                        items: [],
                        fallback: "해당 키워드에 대한 정확한 전통 해몽이나 역사적 기록을 찾지 못했습니다. 지관의 지혜와 보편적 상징성을 바탕으로 풀이해 주십시오."
                    };

                console.log(`[FunctionCalling] Found ${searchResults.length} results for: ${keyword}`);

                result = await chatSession.sendMessage({
                    message: [
                        {
                            functionResponse: {
                                name: "searchDreamSymbol",
                                response: { results: formattedResults }
                            }
                        }
                    ]
                } as any);

            } else if (call.name === "normalizeDreamSymbol") {
                const { keyword, emotion } = call.args as { keyword: string; emotion?: string };
                console.log(`[FunctionCalling] Normalizing: ${keyword}`);

                // 1차: 매핑 테이블
                let symbols = DreamSymbolRepository.normalize(keyword);

                // 2차: AI Fallback
                if (!symbols) {
                    symbols = await normalizeViaAI(client, keyword, emotion);
                }

                // 변환된 심볼로 검색
                const allResults = symbols.flatMap(sym => DreamSymbolRepository.search(sym));
                const snippets = DreamSymbolRepository.toSnippets(allResults);
                collectedSnippets.push(...snippets);

                result = await chatSession.sendMessage({
                    message: [
                        {
                            functionResponse: {
                                name: "normalizeDreamSymbol",
                                response: {
                                    original: keyword,
                                    normalizedSymbols: symbols,
                                    searchResults: snippets.length > 0
                                        ? { found: true, items: snippets }
                                        : { found: false, fallback: "변환 후에도 관련 기록을 찾지 못했습니다." }
                                }
                            }
                        }
                    ]
                } as any);
            } else {
                break; // 알 수 없는 도구
            }
        }

        return {
            message: result.text || "응답을 생성하지 못했습니다.",
            snippets: collectedSnippets,
        };
    } catch (error) {
        console.error("Gemini API error:", error);
        if (error instanceof Error) {
            return { message: `오류가 발생했습니다: ${error.message}`, snippets: [] };
        }
        return { message: "알 수 없는 오류가 발생했습니다.", snippets: [] };
    }
}

export async function generateInterpretation(
    conversationSummary: string,
    evidence?: string
): Promise<InterpretationResult> {
    const client = getGeminiClient();

    if (!client) {
        return {
            title: "천운",
            grade: "상위 5%",
            gilHyung: "길몽",
            meaning:
                "꿈에서 나타난 상징들은 큰 행운이 다가오고 있음을 암시합니다. 특히 재물운과 관련하여 좋은 기운이 감지됩니다.",
            advice:
                "가까운 시일 내에 새로운 기회가 찾아올 것입니다. 망설이지 말고 과감하게 도전하시오. 다만, 복을 자랑하면 달아나는 법이니 입을 무겁게 하시오.",
            talisman: {
                name: "萬事亨通",
                korean: "만사형통부",
                description: "이 부적을 지니면 하는 일마다 막힘이 없습니다.",
                category: "wealth",
                sentiment: 9,
            },
            quote: {
                source: "전통 민속 해몽",
                text: "큰 복이 들어오려면 반드시 전조(前兆)가 있나니...",
            },
            socialSummary: '"하늘이 내린 기회가 당신을 기다리고 있습니다."',
        };
    }

    try {
        const evidenceSection = evidence
            ? `\n\n[Evidence - 대화 중 검색된 해몽 지식]\n${evidence}`
            : '';

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${INTERPRETATION_PROMPT}${evidenceSection}\n\n대화 내용:\n${conversationSummary}`,
                        },
                    ],
                },
            ],
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as InterpretationResult;
        }

        throw new Error("Failed to parse interpretation result");
    } catch (error) {
        console.error("Interpretation generation error:", error);
        return {
            title: "몽해",
            grade: "상위 50%",
            gilHyung: "중립",
            meaning: "꿈의 해석 중 오류가 발생하여 일반적인 해석을 드립니다.",
            advice: "마음을 편히 가지시고, 현실에서 매사 조심하시기 바랍니다.",
            talisman: {
                name: "心安家安",
                korean: "심안가안부",
                description: "마음이 편안하면 집안도 편안해집니다.",
                category: "protection",
                sentiment: 5,
            },
            quote: {
                source: "전통 민속 해몽",
                text: "꿈은 마음의 거울이니 마음이 편안하면 꿈도 편안하리라.",
            },
            socialSummary: '"꿈은 마음의 거울입니다."',
        };
    }
}
