import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path'; 
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes'; 
import { eventRoutes } from './routes/eventRoutes';
import  purchaseRoutes from './routes/purchaseRoutes'; 
import { router as itemRoutes } from './routes/itemRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes);
app.use(authRoutes);
app.use('/api', itemRoutes);
app.use('/api', eventRoutes); 
app.use('/api/purchases', purchaseRoutes); 

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ message: 'Erro interno no servidor' });
});

export { app };
