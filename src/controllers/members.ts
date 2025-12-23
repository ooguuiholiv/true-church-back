import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer Config for Member Photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/members');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'member-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const memberUpload = multer({ storage });

export const getMembers = async (req: Request, res: Response) => {
    const members = await readData('members');
    res.json(members);
};

export const createMember = async (req: Request, res: Response) => {
    const members = await readData<any>('members');
    let photoUrl = req.body.photo;

    if (req.file) {
        photoUrl = `/uploads/members/${req.file.filename}`;
    }

    const newMember = {
        ...req.body,
        id: uuidv4(),
        photo: photoUrl || `https://i.pravatar.cc/150?u=${Math.random()}`,
        // Ensure nested strings from FormData are handled if needed, 
        // but typically ministries comes as a stringified array if using FormData
        ministries: typeof req.body.ministries === 'string' ? JSON.parse(req.body.ministries) : req.body.ministries
    };

    members.push(newMember);
    await writeData('members', members);
    res.status(201).json(newMember);
};

export const updateMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    let members = await readData<any>('members');
    const index = members.findIndex((m: any) => m.id === id);

    if (index !== -1) {
        let photoUrl = req.body.photo || members[index].photo;

        if (req.file) {
            photoUrl = `/uploads/members/${req.file.filename}`;
        }

        const updatedData = { ...req.body };
        if (req.file) updatedData.photo = photoUrl;
        if (typeof updatedData.ministries === 'string') {
            updatedData.ministries = JSON.parse(updatedData.ministries);
        }

        members[index] = { ...members[index], ...updatedData };
        await writeData('members', members);
        res.json(members[index]);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    let members = await readData<any>('members');
    members = members.filter((m: any) => m.id !== id);
    await writeData('members', members);
    res.status(204).send();
};
