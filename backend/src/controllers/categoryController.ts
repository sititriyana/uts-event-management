import { Request, Response } from 'express';
import prisma from '../prisma/client';
import {
  demoCategories,
  demoEvents,
  getCategoryWithCount,
  nextCategoryId,
} from '../demoStore';

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.categoryEvent.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(categories);
  } catch (error) {
    console.warn('Database kategori bermasalah, memakai data demo lokal.');
    return res.json(demoCategories.map(getCategoryWithCount));
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.categoryEvent.findUnique({
      where: { id: Number(id) },
      include: { events: true },
    });
    if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    return res.json(category);
  } catch (error) {
    const category = demoCategories.find((item) => item.id === Number(id));
    if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });

    return res.json({
      ...category,
      events: demoEvents.filter((event) => event.categoryId === category.id),
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description, color } = req.body;

  if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

  try {
    const category = await prisma.categoryEvent.create({
      data: { name, description, color: color || '#6366f1' },
    });
    return res.status(201).json(category);
  } catch (error) {
    const timestamp = new Date().toISOString();
    const category = {
      id: nextCategoryId(),
      name,
      description: description || '',
      color: color || '#7c3aed',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    demoCategories.push(category);
    return res.status(201).json(getCategoryWithCount(category));
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, color } = req.body;

  try {
    const category = await prisma.categoryEvent.update({
      where: { id: Number(id) },
      data: { name, description, color },
    });
    return res.json(category);
  } catch (error) {
    const index = demoCategories.findIndex((item) => item.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });

    demoCategories[index] = {
      ...demoCategories[index],
      name: name ?? demoCategories[index].name,
      description: description ?? demoCategories[index].description,
      color: color ?? demoCategories[index].color,
      updatedAt: new Date().toISOString(),
    };

    return res.json(getCategoryWithCount(demoCategories[index]));
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.categoryEvent.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    const index = demoCategories.findIndex((item) => item.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });

    demoCategories.splice(index, 1);
    return res.json({ message: 'Kategori berhasil dihapus.' });
  }
};
