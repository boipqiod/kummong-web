import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface DreamSymbol {
    symbol: string;
    korean_meaning: string;
    gil_hyung: string;
    context_guide: string;
    cultural_note: string;
}

export class DreamSymbolRepository {
    private static symbols: DreamSymbol[] = [];
    private static isInitialized = false;

    static async initialize() {
        if (this.isInitialized) return;

        try {
            // 프로젝트 루트(kummong-web)의 상위 폴더에 data가 있다고 가정
            // 로컬 개발 환경: kummong-web/../data/korean_traditional_symbols.csv
            const csvPath = path.join(process.cwd(), '../data/korean_traditional_symbols.csv');

            // 파일이 존재하는지 확인하고, 없으면 public/data 등 다른 경로 시도 (배포 대비)
            // 여기서는 로컬 환경을 우선시함.

            const fileContent = fs.readFileSync(csvPath, 'utf-8');

            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            }) as DreamSymbol[];

            this.symbols = records;
            this.isInitialized = true;
            console.log(`[DreamSymbolRepository] Loaded ${this.symbols.length} symbols.`);
        } catch (error) {
            console.error('[DreamSymbolRepository] Failed to load CSV:', error);
            // 에러 발생 시 빈 배열로 진행하여 앱이 죽지는 않게 함
            this.symbols = [];
        }
    }

    static search(keyword: string): DreamSymbol[] {
        if (!this.isInitialized) {
            console.warn('[DreamSymbolRepository] Search called before initialization.');
            return [];
        }

        const normalizedKeyword = keyword.trim();
        if (!normalizedKeyword) return [];

        return this.symbols.filter(item =>
            item.symbol.includes(normalizedKeyword) ||
            normalizedKeyword.includes(item.symbol) // "검은 돼지" 입력 시 "돼지" 심볼 매칭
        );
    }

    static getAll(): DreamSymbol[] {
        return this.symbols;
    }
}
