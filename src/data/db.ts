import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = process.env.DATA_PATH || path.resolve(process.cwd(), 'src/data');

export async function readData<T>(filename: string): Promise<T[]> {
    try {
        const filePath = path.join(DATA_DIR, `${filename}.json`);
        console.log(`[DB] Reading from: ${filePath}`);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[DB] Error reading ${filename}:`, error);
        return [];
    }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
