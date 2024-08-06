import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, Role } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
  async register(email: string, password: string, role: string): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const roleEnum = Role[role.toUpperCase() as keyof typeof Role];

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: roleEnum,
      },
    });

    console.info(`New user created: ${email}, role: ${roleEnum}`);
    return user;
  }

  async login(email: string, password: string): Promise<{ token: string, role: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.info(`Token generated for user: ${email}`);
    return { token, role: user.role };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    console.info(`Retrieved all users: ${users.map(user => user.email).join(', ')}`);
    return users;
  }
}
