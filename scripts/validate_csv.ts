
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const dataDir = path.join(process.cwd(), '../data');

const files = [
    'korean_traditional_symbols.csv',
    'global_dream_dictionary.csv',
    'historical_dream_records.csv'
];

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        console.log(`[PASS] ${file}: ${records.length} records parsed successfully.`);
    } catch (error: any) {
        console.error(`[FAIL] ${file}: ${error.message}`);
        if (error.code === 'CSV_RECORD_INCONSISTENT_COLUMNS') {
            console.error(`Error details: Line ${error.lines}, columns length is ${error.columns?.length || 'unknown'}`);
        }
    }
});
