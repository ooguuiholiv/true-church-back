import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';

export const getMinistries = async (req: Request, res: Response) => {
    const ministries = await readData('ministries');
    res.json(ministries);
};

export const createMinistry = async (req: Request, res: Response) => {
    const ministries = await readData<any>('ministries');
    const newMinistry = { ...req.body, id: uuidv4() };
    ministries.push(newMinistry);
    await writeData('ministries', ministries);
    res.status(201).json(newMinistry);
};
