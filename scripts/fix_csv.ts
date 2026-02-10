
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), '../data');

function fixKoreanSymbols() {
    const filePath = path.join(dataDir, 'korean_traditional_symbols.csv');
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fixedLines = lines.map((line, index) => {
        if (index === 0 || !line.trim()) return line; // Header or empty

        // Naive split by comma, respecting quotes is hard without a library, but these files 
        // seem to not use quotes much, which is the problem.
        // But wait, I added quotes to line 4. My naive split will break it.
        // So I should use a regex or just handle the specific confirmed structure.

        // Let's assume standard CSV (no quotes for now except what I added).
        // If I use a regex to match the fields, it's safer.
        // Expected: 5 fields.

        // If line has quotes, I'll trust it's fixed or handle it carefully.
        if (line.includes('"')) return line; // Already fixed or quoted

        const parts = line.split(',');
        if (parts.length === 5) return line; // OK
        if (parts.length === 6) {
            // Assume split in context_guide (index 3 and 4)
            // sym, mean, gil, context1, context2, note
            const fixedParts = [
                parts[0],
                parts[1],
                parts[2],
                `"${parts[3]}, ${parts[4]}"`, // Quote the merged field
                parts[5]
            ];
            console.log(`[Fixed Line ${index + 1}] Merged context (6 cols): ${fixedParts[3]}`);
            return fixedParts.join(',');
        }
        if (parts.length === 7) {
            // sym, mean, gil, ctx1, ctx2, note1, note2
            const fixedParts = [
                parts[0],
                parts[1],
                parts[2],
                `"${parts[3]}, ${parts[4]}"`,
                `"${parts[5]}, ${parts[6]}"`
            ];
            console.log(`[Fixed Line ${index + 1}] Merged context & note (7 cols): ${fixedParts[3]} / ${fixedParts[4]}`);
            return fixedParts.join(',');
        }
        return line; // Unknown case
    });

    fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf-8');
    console.log('Fixed korean_traditional_symbols.csv');
}

function fixGlobalDictionary() {
    const filePath = path.join(dataDir, 'global_dream_dictionary.csv');
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fixedLines = lines.map((line, index) => {
        if (index === 0 || !line.trim()) return line;

        if (line.includes('"')) return line;

        const parts = line.split(',');
        if (parts.length === 4) return line;
        if (parts.length === 5) {
            // sym, west, psych1, psych2, sent
            const fixedParts = [
                parts[0],
                parts[1],
                `"${parts[2]}, ${parts[3]}"`,
                parts[4]
            ];
            console.log(`[Fixed Line ${index + 1}] Merged psych: ${fixedParts[2]}`);
            return fixedParts.join(',');
        }
        if (parts.length === 6) {
            // sym, west, psych1, psych2, psych3, sent
            const fixedParts = [
                parts[0],
                parts[1],
                `"${parts[2]}, ${parts[3]}, ${parts[4]}"`,
                parts[5]
            ];
            console.log(`[Fixed Line ${index + 1}] Merged psych (3 parts): ${fixedParts[2]}`);
            return fixedParts.join(',');
        }
        return line;
    });

    fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf-8');
    console.log('Fixed global_dream_dictionary.csv');
}

fixKoreanSymbols();
fixGlobalDictionary();
