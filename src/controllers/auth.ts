import { Request, Response } from 'express';
import { readData, writeData } from '../data/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);
    const users = await readData<any>('users');
    const user = users.find((u: any) => u.email === email);

    if (!user) {
        console.log(`[AUTH] User not found: ${email}`);
        return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`[AUTH] Password valid: ${isPasswordValid}`);

    if (isPasswordValid) {
        const { password: _, ...userWithoutPassword } = user;
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ user: userWithoutPassword, token });
    } else {
        res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { email, password, name, role, memberId, photo } = req.body;
    const users = await readData<any>('users');

    // Check if user already exists for this member
    const existingIndex = users.findIndex((u: any) => u.memberId === memberId);

    if (existingIndex !== -1) {
        // If an email is provided for update, check if it's already in use by another user
        if (email && users.find((u: any) => u.email === email && u.memberId !== memberId)) {
            return res.status(400).json({ message: 'Este e-mail já está em uso por outro usuário.' });
        }

        // Update existing user
        const updateData: any = {
            ...users[existingIndex],
            email: email || users[existingIndex].email,
            name: name || users[existingIndex].name,
            photo: photo || users[existingIndex].photo,
            role: 'admin' // Force admin access as requested
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        users[existingIndex] = updateData;
        await writeData('users', users);
        return res.json(users[existingIndex]);
    }

    // Check if email is already in use by any user (since it's a new user creation)
    if (users.find((u: any) => u.email === email)) {
        return res.status(400).json({ message: 'Este e-mail já está em uso por outro usuário.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name,
        photo,
        role: 'admin', // Force admin access as requested
        memberId
    };

    users.push(newUser);
    await writeData('users', users);
    res.status(201).json(newUser);
};

export const updatePassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    const users = await readData<any>('users');
    const index = users.findIndex((u: any) => u.email === email);

    if (index !== -1) {
        users[index].password = await bcrypt.hash(newPassword, 10);
        await writeData('users', users);
        res.json({ message: 'Senha atualizada com sucesso.' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
};

export const deleteUserByMemberId = async (memberId: string) => {
    let users = await readData<any>('users');
    users = users.filter((u: any) => u.memberId !== memberId);
    await writeData('users', users);
};
