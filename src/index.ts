import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import memberRoutes from './routes/members';
import transactionRoutes from './routes/transactions';
import eventRoutes from './routes/events';
import kidsRoutes from './routes/kids';
import ministryRoutes from './routes/ministries';
import scheduleRoutes from './routes/schedules';
import secretaryRoutes from './routes/secretary';
import authRoutes from './routes/auth';

import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic health check
app.get('/', (req, res) => {
    res.json({ message: 'True Church ERP API is running' });
});

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/kids', kidsRoutes);
app.use('/api/ministries', ministryRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/secretary', secretaryRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
