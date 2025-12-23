import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });

export const getDocuments = async (req: Request, res: Response) => {
    const docs = await readData('documents');
    res.json(docs);
};

export const createDocument = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const docs = await readData<any>('documents');
    const newDoc = {
        id: uuidv4(),
        title: req.body.title || req.file.originalname,
        category: req.body.category || 'Outros',
        uploadDate: new Date().toISOString(),
        fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: `/uploads/${req.file.filename}`,
    };

    docs.push(newDoc);
    await writeData('documents', docs);
    res.status(201).json(newDoc);
};

export const deleteDocument = async (req: Request, res: Response) => {
    const { id } = req.params;
    let docs = await readData<any>('documents');
    docs = docs.filter((d: any) => d.id !== id);
    await writeData('documents', docs);
    res.status(204).send();
};

export const globalSearch = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        return res.json({ results: [] });
    }

    const query = q.toLowerCase();

    const [members, events, transactions] = await Promise.all([
        readData<any>('members'),
        readData<any>('events'),
        readData<any>('transactions')
    ]);

    const results: any[] = [];

    // Search members
    members.forEach((m: any) => {
        if (m.name.toLowerCase().includes(query) || m.email?.toLowerCase().includes(query)) {
            results.push({ type: 'Membro', name: m.name, id: m.id, path: '/people' });
        }
    });

    // Search events
    events.forEach((e: any) => {
        if (e.title.toLowerCase().includes(query) || e.description?.toLowerCase().includes(query)) {
            results.push({ type: 'Evento', name: e.title, id: e.id, path: '/events' });
        }
    });

    // Search transactions (by description)
    transactions.forEach((t: any) => {
        if (t.description.toLowerCase().includes(query)) {
            results.push({ type: 'Financeiro', name: `${t.description} (${t.type === 'income' ? '+' : '-'} R$${t.amount})`, id: t.id, path: '/finance' });
        }
    });

    res.json({ results: results.slice(0, 10) });
};

export const getSmartNotifications = async (req: Request, res: Response) => {
    const [members, events] = await Promise.all([
        readData<any>('members'),
        readData<any>('events')
    ]);

    const notifications: any[] = [];
    const today = new Date();
    const todayDayMonth = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

    // Birthdays
    members.forEach((m: any) => {
        const birthdayStr = m.birthDate; // format YYYY-MM-DD
        if (birthdayStr) {
            const [y, mStr, dStr] = birthdayStr.split('-');
            if (mStr === String(today.getMonth() + 1).padStart(2, '0') && dStr === String(today.getDate()).padStart(2, '0')) {
                notifications.push({
                    id: `bday-${m.id}`,
                    type: 'birthday',
                    title: 'Aniversariante do Dia!',
                    message: `${m.name} está completando mais um ano de vida hoje.`,
                    path: '/dashboard'
                });
            }
        }
    });

    // Events ending soon
    events.forEach((e: any) => {
        const eventDate = new Date(e.date);
        const timeDiff = eventDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff >= 0 && daysDiff <= 3) {
            notifications.push({
                id: `event-${e.id}`,
                type: 'event',
                title: 'Evento Próximo',
                message: `O evento "${e.title}" acontece em ${daysDiff === 0 ? 'hoje!' : daysDiff + ' dias.'}`,
                path: '/events'
            });
        }
    });

    res.json({ notifications });
};
