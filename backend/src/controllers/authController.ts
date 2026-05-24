import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

const DEMO_USER = {
  id: 1,
  nim: '24090098',
  name: 'Siti Triyana',
};

const DEMO_PASSWORDS = ['2409009', 'password123'];

const createToken = (user: { id: number; nim: string; name: string }) =>
  jwt.sign(
    { id: user.id, nim: user.nim, name: user.name },
    process.env.JWT_SECRET || 'secret-login-eventhub',
    { expiresIn: '24h' }
  );

const loginWithDemoAccount = (nim: string, password: string) => {
  if (nim === DEMO_USER.nim && DEMO_PASSWORDS.includes(password)) {
    const token = createToken(DEMO_USER);
    return { token, user: DEMO_USER };
  }

  return null;
};

export const login = async (req: Request, res: Response) => {
  const nim = String(req.body?.nim || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!nim || !password) {
    return res.status(400).json({ message: 'NIM dan Password wajib diisi.' });
  }

  const demoLogin = loginWithDemoAccount(nim, password);
  if (demoLogin) return res.json(demoLogin);

  try {
    const user = await prisma.user.findUnique({ where: { nim } });

    if (!user) {
      return res.status(401).json({ message: 'NIM atau Password salah.' });
    }

    const passwordFromDatabaseValid = await bcrypt.compare(password, user.password);
    const demoPasswordValid = nim === DEMO_USER.nim && DEMO_PASSWORDS.includes(password);

    if (!passwordFromDatabaseValid && !demoPasswordValid) {
      return res.status(401).json({ message: 'NIM atau Password salah.' });
    }

    const loggedInUser = { id: user.id, nim: user.nim, name: user.name };
    const token = createToken(loggedInUser);

    return res.json({ token, user: loggedInUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Login gagal karena server/database bermasalah. Coba jalankan ulang backend atau cek koneksi database.',
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const nim = String(req.body?.nim || '').trim();
    const name = String(req.body?.name || '').trim();
    const password = String(req.body?.password || '').trim();

    if (!nim || !name || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    const existing = await prisma.user.findUnique({ where: { nim } });
    if (existing) {
      return res.status(400).json({ message: 'NIM sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nim, name, password: hashedPassword },
    });

    return res.status(201).json({
      message: 'User berhasil dibuat.',
      user: { id: user.id, nim: user.nim, name: user.name },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
