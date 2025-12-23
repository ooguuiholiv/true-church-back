import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';

export const getEvents = async (req: Request, res: Response) => {
    const data = await readData('events');
    res.json(data);
};

export const createEvent = async (req: Request, res: Response) => {
    const data = await readData<any>('events');
    const newItem = { ...req.body, id: uuidv4() };
    data.push(newItem);
    await writeData('events', data);
    res.status(201).json(newItem);
};

export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    let data = await readData<any>('events');
    const index = data.findIndex((e: any) => e.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        await writeData('events', data);
        res.json(data[index]);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    let data = await readData<any>('events');
    const event = data.find((e: any) => e.id === id);

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'open') {
        return res.status(400).json({ message: 'Event must be closed before deletion' });
    }

    data = data.filter((e: any) => e.id !== id);
    await writeData('events', data);
    res.status(204).send();
};

export const getRegistrations = async (req: Request, res: Response) => {
    const { id } = req.params;
    const registrations = await readData<any>('event_registrations');
    const filtered = registrations.filter((r: any) => r.eventId === id);
    res.json(filtered);
};

export const registerParticipant = async (req: Request, res: Response) => {
    const { id } = req.params;
    const registrations = await readData<any>('event_registrations');

    const newRegistration = {
        ...req.body,
        id: uuidv4(),
        eventId: id,
        createdAt: new Date().toISOString()
    };

    registrations.push(newRegistration);
    await writeData('event_registrations', registrations);
    res.status(201).json(newRegistration);
};

export const updateRegistration = async (req: Request, res: Response) => {
    const { regId } = req.params;
    let registrations = await readData<any>('event_registrations');
    const index = registrations.findIndex((r: any) => r.id === regId);

    if (index !== -1) {
        registrations[index] = { ...registrations[index], ...req.body };
        await writeData('event_registrations', registrations);
        res.json(registrations[index]);
    } else {
        res.status(404).json({ message: 'Registration not found' });
    }
};

