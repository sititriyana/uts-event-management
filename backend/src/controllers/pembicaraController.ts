import { Request, Response } from 'express';
import prisma from '../prisma/client';
import {
  demoEvents,
  demoPembicara,
  getPembicaraWithCount,
  nextPembicaraId,
} from '../demoStore';

export const getAllPembicara = async (_req: Request, res: Response) => {
  try {
    const pembicara = await prisma.pembicara.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(pembicara);
  } catch (error) {
    console.warn('Database pembicara bermasalah, memakai data demo lokal.');
    return res.json(demoPembicara.map(getPembicaraWithCount));
  }
};

export const getPembicaraById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pembicara = await prisma.pembicara.findUnique({
      where: { id: Number(id) },
      include: { events: true },
    });
    if (!pembicara) return res.status(404).json({ message: 'Pembicara tidak ditemukan.' });
    return res.json(pembicara);
  } catch (error) {
    const pembicara = demoPembicara.find((item) => item.id === Number(id));
    if (!pembicara) return res.status(404).json({ message: 'Pembicara tidak ditemukan.' });

    return res.json({
      ...pembicara,
      events: demoEvents.filter((event) => event.pembicaraId === pembicara.id),
    });
  }
};

export const createPembicara = async (req: Request, res: Response) => {
  const { name, title, expertise, email, phone, bio, photoUrl } = req.body;

  if (!name || !title || !expertise) {
    return res.status(400).json({ message: 'Nama, jabatan, dan keahlian wajib diisi.' });
  }

  try {
    const pembicara = await prisma.pembicara.create({
      data: { name, title, expertise, email, phone, bio, photoUrl },
    });
    return res.status(201).json(pembicara);
  } catch (error) {
    const timestamp = new Date().toISOString();
    const pembicara = {
      id: nextPembicaraId(),
      name,
      title,
      expertise,
      email: email || '',
      phone: phone || '',
      bio: bio || '',
      photoUrl: photoUrl || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    demoPembicara.push(pembicara);
    return res.status(201).json(getPembicaraWithCount(pembicara));
  }
};

export const updatePembicara = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, title, expertise, email, phone, bio, photoUrl } = req.body;

  try {
    const pembicara = await prisma.pembicara.update({
      where: { id: Number(id) },
      data: { name, title, expertise, email, phone, bio, photoUrl },
    });
    return res.json(pembicara);
  } catch (error) {
    const index = demoPembicara.findIndex((item) => item.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Pembicara tidak ditemukan.' });

    demoPembicara[index] = {
      ...demoPembicara[index],
      name: name ?? demoPembicara[index].name,
      title: title ?? demoPembicara[index].title,
      expertise: expertise ?? demoPembicara[index].expertise,
      email: email ?? demoPembicara[index].email,
      phone: phone ?? demoPembicara[index].phone,
      bio: bio ?? demoPembicara[index].bio,
      photoUrl: photoUrl ?? demoPembicara[index].photoUrl,
      updatedAt: new Date().toISOString(),
    };

    return res.json(getPembicaraWithCount(demoPembicara[index]));
  }
};

export const deletePembicara = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.pembicara.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Pembicara berhasil dihapus.' });
  } catch (error) {
    const index = demoPembicara.findIndex((item) => item.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Pembicara tidak ditemukan.' });

    demoPembicara.splice(index, 1);
    return res.json({ message: 'Pembicara berhasil dihapus.' });
  }
};
