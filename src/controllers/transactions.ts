import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';

export const getTransactions = async (req: Request, res: Response) => {
    const data = await readData('transactions');
    res.json(data);
};

export const createTransaction = async (req: Request, res: Response) => {
    const data = await readData<any>('transactions');
    const { status, ...bodyWithoutStatus } = req.body;
    const newItem = { ...bodyWithoutStatus, id: uuidv4() };
    data.push(newItem);
    await writeData('transactions', data);
    res.status(201).json(newItem);
};

export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    let data = await readData<any>('transactions');
    const index = data.findIndex((t: any) => t.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body, id }; // Ensure ID stays same
        await writeData('transactions', data);
        res.json(data[index]);
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    let data = await readData<any>('transactions');
    data = data.filter((t: any) => t.id !== id);
    await writeData('transactions', data);
    res.status(204).send();
};
