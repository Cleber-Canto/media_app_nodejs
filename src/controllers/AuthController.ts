import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { Prisma } from '@prisma/client';

const authService = new AuthService();

export class AuthController {
  async register(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password, role } = request.body;
      const user = await authService.register(email, password, role);
      console.info(`User registered successfully: ${user.email}`);
      return response.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.warn(`Registration error: Email already exists - ${request.body.email}`);
          return response.status(400).json({ message: 'Email already exists' });
        }
      }
      console.error('Registration error:', error);
      if (error instanceof Error) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        return response.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async login(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const { token, role } = await authService.login(email, password);
      console.info(`User logged in successfully: ${email}`);
      return response.status(200).json({ token, role });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Invalid email or password') {
        console.warn(`Login error: Invalid email or password - ${email}`);
        return response.status(400).json({ message: 'Invalid email or password' });
      }
      console.error('Login error:', error);
      if (error instanceof Error) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        return response.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
      const users = await authService.getAllUsers();
      console.info(`Fetched ${users.length} users`);
      return response.status(200).json(users);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      if (error instanceof Error) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        return response.status(500).json({ message: 'Unknown error' });
      }
    }
  }
}
