import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';

export const getSchedules = async (req: Request, res: Response) => {
    const schedules = await readData('schedules');
    res.json(schedules);
};

export const createSchedule = async (req: Request, res: Response) => {
    const schedules = await readData<any>('schedules');
    const newSchedule = { ...req.body, id: uuidv4(), status: 'Pendente' };
    schedules.push(newSchedule);
    await writeData('schedules', schedules);
    res.status(201).json(newSchedule);
};

export const updateSchedule = async (req: Request, res: Response) => {
    const { id } = req.params;
    let schedules = await readData<any>('schedules');
    const index = schedules.findIndex((s: any) => s.id === id);
    if (index !== -1) {
        schedules[index] = { ...schedules[index], ...req.body };
        await writeData('schedules', schedules);
        res.json(schedules[index]);
    } else {
        res.status(404).json({ message: 'Schedule not found' });
    }
};
