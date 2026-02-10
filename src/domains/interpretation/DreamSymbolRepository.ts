import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface DreamKnowledge {
    symbol: string;
    meaning: string;
    source: string;
    category: 'TRADITIONAL' | 'HISTORICAL' | 'PSYCHOLOGICAL';
    relevanceScore?: number;
}

type MappingTable = Record<string, string[]>;

export class DreamSymbolRepository {
    private static knowledgeBase: DreamKnowledge[] = [];
    private static mappingTable: MappingTable = {};
    private static isInitialized = false;

    static async initialize() {
        if (this.isInitialized) return;

        try {
            const dataDir = path.join(process.cwd(), '../data');

            // 1. 매핑 테이블 로드
            const mappingPath = path.join(dataDir, 'modern_to_traditional_mapping.json');
            if (fs.existsSync(mappingPath)) {
                const mappingContent = fs.readFileSync(mappingPath, 'utf-8');
                this.mappingTable = JSON.parse(mappingContent);
                console.log(`[DreamSymbolRepository] Loaded ${Object.keys(this.mappingTable).length} mapping entries.`);
            }

            // 2. CSV 데이터 로드
            const files = [
                { name: 'korean_traditional_symbols.csv', category: 'TRADITIONAL' as const },
                { name: 'global_dream_dictionary.csv', category: 'PSYCHOLOGICAL' as const },
                { name: 'historical_dream_records.csv', category: 'HISTORICAL' as const }
            ];

            const results = await Promise.all(files.map(async (file) => {
                const filePath = path.join(dataDir, file.name);
                if (!fs.existsSync(filePath)) {
                    console.warn(`[DreamSymbolRepository] File not found: ${filePath}`);
                    return [];
                }

                const content = fs.readFileSync(filePath, 'utf-8');
                const records = parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                });

                return this.normalizeData(records, file.category);
            }));

            this.knowledgeBase = results.flat();
            this.isInitialized = true;
            console.log(`[DreamSymbolRepository] Loaded ${this.knowledgeBase.length} knowledge items.`);
        } catch (error) {
            console.error('[DreamSymbolRepository] Failed to load knowledge base:', error);
            this.knowledgeBase = [];
        }
    }

    /**
     * 현대어를 전통 상징어로 변환 (매핑 테이블 기반)
     * 매핑 결과가 없으면 null 반환 → AI Fallback 필요
     */
    static normalize(keyword: string): string[] | null {
        const normalized = keyword.trim().toLowerCase();

        // 매핑 테이블에서 직접 매칭
        for (const [modern, traditionals] of Object.entries(this.mappingTable)) {
            if (normalized.includes(modern) || modern.includes(normalized)) {
                console.log(`[Normalizing] "${keyword}" → ${JSON.stringify(traditionals)}`);
                return traditionals;
            }
        }

        return null; // AI Fallback 필요
    }

    private static normalizeData(records: any[], category: 'TRADITIONAL' | 'HISTORICAL' | 'PSYCHOLOGICAL'): DreamKnowledge[] {
        return records.map(record => {
            switch (category) {
                case 'TRADITIONAL':
                    return {
                        symbol: record.symbol,
                        meaning: `${record.korean_meaning}. ${record.cultural_note || ''}`,
                        source: '전통 민속 해몽',
                        category
                    };
                case 'PSYCHOLOGICAL':
                    return {
                        symbol: record.symbol,
                        meaning: `${record.western_interpretation}. 심리적 의미: ${record.psychological_meaning}`,
                        source: '현대 심리학',
                        category
                    };
                case 'HISTORICAL':
                    return {
                        symbol: record.dream_content,
                        meaning: `${record.historical_interpretation}. 조언: ${record.advice}`,
                        source: record.source || '역사적 기록',
                        category
                    };
                default:
                    return null;
            }
        }).filter((item): item is DreamKnowledge => item !== null);
    }

    /**
     * 키워드로 지식 검색 + 연관성 점수 계산
     * 매핑 테이블을 통해 1차 노멀라이징 시도 후 검색
     */
    static search(keyword: string): DreamKnowledge[] {
        if (!this.isInitialized) {
            console.warn('[DreamSymbolRepository] Search called before initialization.');
            return [];
        }

        const normalizedKeyword = keyword.trim().toLowerCase();
        if (!normalizedKeyword) return [];

        // 1. 매핑 테이블로 노멀라이징 시도
        const mappedSymbols = this.normalize(normalizedKeyword);
        const searchKeywords = mappedSymbols
            ? [normalizedKeyword, ...mappedSymbols.map(s => s.toLowerCase())]
            : [normalizedKeyword];

        // 2. 모든 키워드로 검색
        const resultsMap = new Map<string, DreamKnowledge>();

        for (const searchKey of searchKeywords) {
            const matches = this.knowledgeBase.filter(item =>
                item.symbol.toLowerCase().includes(searchKey) ||
                searchKey.includes(item.symbol.toLowerCase()) ||
                item.meaning.toLowerCase().includes(searchKey)
            );

            for (const match of matches) {
                const key = `${match.symbol}-${match.category}`;
                if (!resultsMap.has(key)) {
                    // 연관성 점수 계산
                    const score = this.calculateRelevance(match, searchKey, normalizedKeyword);
                    resultsMap.set(key, { ...match, relevanceScore: score });
                }
            }
        }

        // 3. 연관성 점수 기반 정렬
        const results = Array.from(resultsMap.values());
        return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    /**
     * 연관성 점수 계산
     * - symbol 정확 일치: +10
     * - symbol 부분 일치: +5
     * - meaning 포함: +3
     * - 카테고리 보너스: HISTORICAL +2, TRADITIONAL +1
     */
    private static calculateRelevance(
        item: DreamKnowledge,
        searchKey: string,
        originalKeyword: string
    ): number {
        let score = 0;

        const symbolLower = item.symbol.toLowerCase();

        // 정확 일치
        if (symbolLower === searchKey || symbolLower === originalKeyword) {
            score += 10;
        }
        // 부분 일치
        else if (symbolLower.includes(searchKey) || searchKey.includes(symbolLower)) {
            score += 5;
        }
        // meaning 포함
        if (item.meaning.toLowerCase().includes(searchKey)) {
            score += 3;
        }

        // 카테고리 보너스
        if (item.category === 'HISTORICAL') score += 2;
        if (item.category === 'TRADITIONAL') score += 1;

        return score;
    }

    /**
     * 스니펫 형식으로 변환 (AI에 주입할 최적화된 텍스트)
     */
    static toSnippets(results: DreamKnowledge[], maxCount: number = 5): string[] {
        return results
            .slice(0, maxCount)
            .map(k => `[${k.source}] ${k.meaning}`);
    }

    static getAll(): DreamKnowledge[] {
        return this.knowledgeBase;
    }
}