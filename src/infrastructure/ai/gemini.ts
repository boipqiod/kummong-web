import { GoogleGenAI } from "@google/genai";
import { JIGWAN_SYSTEM_PROMPT, INTERPRETATION_PROMPT } from "./prompts";
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
        ],
    } as any,
];

export async function chat(
    messages: ChatMessage[],
    userMessage: string
): Promise<string> {
    const client = getGeminiClient();

    if (!client) {
        // Return mock response
        const response = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
        mockIndex++;
        return response;
    }

    try {
        // 데이터 리포지토리 초기화 (최초 1회 로딩)
        await DreamSymbolRepository.initialize();

        const chat = client.chats.create({
            model: "gemini-2.5-flash",
            // @ts-ignore
            config: {
                systemInstruction: JIGWAN_SYSTEM_PROMPT,
                tools: tools,
            },
            history: messages,
        });

        // Send User Message
        let result = await chat.sendMessage({
            message: userMessage,
        } as any);

        // Function Calling Loop
        // @google/genai SDK response structure handling
        // result.functionCalls returns FunctionCall[] | undefined
        const functionCalls = result.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            if (call.name === "searchDreamSymbol") {
                const { keyword } = call.args as { keyword: string };
                console.log(`[FunctionCalling] Searching for symbol: ${keyword}`);

                const searchResults = DreamSymbolRepository.search(keyword);
                const searchResponse =
                    searchResults.length > 0
                        ? searchResults
                        : "해당 키워드에 대한 정확한 전통 해몽 기록을 찾을 수 없습니다.";

                const functionResponse = {
                    name: "searchDreamSymbol",
                    response: {
                        name: "searchDreamSymbol",
                        content: searchResponse
                    },
                };

                // Send function response back to the model
                result = await chat.sendMessage({
                    message: [
                        {
                            functionResponse: {
                                name: "searchDreamSymbol",
                                response: { results: searchResponse }
                            }
                        }
                    ]
                } as any);
            }
        }

        return result.text || "응답을 생성하지 못했습니다.";
    } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback or retry logic could be added here
        if (error instanceof Error) {
            return `오류가 발생했습니다: ${error.message}`;
        }
        return "알 수 없는 오류가 발생했습니다.";
    }
}

export async function generateInterpretation(
    conversationSummary: string
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
            },
            socialSummary: '"하늘이 내린 기회가 당신을 기다리고 있습니다."',
        };
    }

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${INTERPRETATION_PROMPT}\n\n대화 내용:\n${conversationSummary}`,
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
            },
            socialSummary: '"꿈은 마음의 거울입니다."',
        };
    }
}
