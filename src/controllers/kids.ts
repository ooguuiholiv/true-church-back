import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';

// Crianças cadastradas na igreja (Base)
export const getKids = async (req: Request, res: Response) => {
    const kids = await readData<any>('kids_base');
    res.json(kids);
};

export const registerKid = async (req: Request, res: Response) => {
    const kids = await readData<any>('kids_base');
    const newKid = {
        ...req.body,
        id: uuidv4(),
        createdAt: new Date().toISOString()
    };
    kids.push(newKid);
    await writeData('kids_base', kids);
    res.status(201).json(newKid);
};

export const updateKid = async (req: Request, res: Response) => {
    const { id } = req.params;
    let kids = await readData<any>('kids_base');
    const index = kids.findIndex((k: any) => k.id === id);
    if (index !== -1) {
        kids[index] = { ...kids[index], ...req.body, id };
        await writeData('kids_base', kids);
        res.json(kids[index]);
    } else {
        res.status(404).json({ message: 'Criança não encontrada' });
    }
};

// Crianças que estão presentes hoje (Check-in ativo)
export const getPresentKids = async (req: Request, res: Response) => {
    const present = await readData<any>('kids_present');
    res.json(present);
};

export const checkinKid = async (req: Request, res: Response) => {
    const { kidId, room } = req.body;
    const baseKids = await readData<any>('kids_base');
    const presentKids = await readData<any>('kids_present');

    const kid = baseKids.find((k: any) => k.id === kidId);
    if (!kid) return res.status(404).json({ message: 'Criança não cadastrada' });

    const alreadyPresent = presentKids.find((k: any) => k.id === kidId);
    if (alreadyPresent) return res.status(400).json({ message: 'Criança já está na sala' });

    const checkinData = {
        ...kid,
        room,
        checkinTime: new Date().toISOString(),
        status: 'present'
    };

    presentKids.push(checkinData);
    await writeData('kids_present', presentKids);
    res.status(201).json(checkinData);
};

export const checkoutKid = async (req: Request, res: Response) => {
    const { id } = req.params;
    let presentKids = await readData<any>('kids_present');
    presentKids = presentKids.filter((k: any) => k.id !== id);
    await writeData('kids_present', presentKids);
    res.status(204).send();
};
