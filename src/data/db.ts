import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../data');

export async function readData<T>(filename: string): Promise<T[]> {
    try {
        const filePath = path.join(DATA_DIR, `${filename}.json`);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
