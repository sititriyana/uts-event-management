import { Request, Response } from 'express';
import prisma from '../prisma/client';
import {
  demoEvents,
  getEventWithRelations,
  nextEventId,
} from '../demoStore';

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
        pembicara: true,
      },
      orderBy: { date: 'asc' },
    });
    return res.json(events);
  } catch (error) {
    console.warn('Database event bermasalah, memakai data demo lokal.');
    return res.json(demoEvents.map(getEventWithRelations));
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: { category: true, pembicara: true },
    });
    if (!event) return res.status(404).json({ message: 'Event tidak ditemukan.' });
    return res.json(event);
  } catch (error) {
    const event = demoEvents.find((item) => item.id === Number(id));
    if (!event) return res.status(404).json({ message: 'Event tidak ditemukan.' });
    return res.json(getEventWithRelations(event));
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date, time, location, capacity, status, imageUrl, categoryId, pembicaraId } = req.body;

  if (!title || !date || !time || !location || !categoryId || !pembicaraId) {
    return res.status(400).json({ message: 'Field wajib: title, date, time, location, category, pembicara.' });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
        capacity: Number(capacity) || 0,
        status: status || 'upcoming',
        imageUrl,
        categoryId: Number(categoryId),
        pembicaraId: Number(pembicaraId),
      },
      include: { category: true, pembicara: true },
    });
    return res.status(201).json(event);
  } catch (error) {
    const timestamp = new Date().toISOString();
    const event = {
      id: nextEventId(),
      title,
      description: description || '',
      date: new Date(date).toISOString(),
      time,
      location,
      capacity: Number(capacity) || 0,
      status: status || 'upcoming',
      imageUrl: imageUrl || '',
      categoryId: Number(categoryId),
      pembicaraId: Number(pembicaraId),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    demoEvents.push(event);
    return res.status(201).json(getEventWithRelations(event));
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date, time, location, capacity, status, imageUrl, categoryId, pembicaraId } = req.body;

  try {
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        time,
        location,
        capacity: capacity ? Number(capacity) : undefined,
        status,
        imageUrl,
        categoryId: categoryId ? Number(categoryId) : undefined,
        pembicaraId: pembicaraId ? Number(pembicaraId) : undefined,
      },
      include: { category: true, pembicara: true },
    });
    return res.json(event);
  } catch (error) {
    const index = demoEvents.findIndex((item) => item.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Event tidak ditemukan.' });

    demoEvents[index] = {
      ...demoEvents[index],
      title: title ?? demoEvents[index].title,
      description: description ?? demoEvents[index].description,
      date: date ? new Date(date).toISOString() : demoEvents[index].date,
      time: time ?? demoEvents[index].time,
      location: location ?? demoEvents[index].location,
      capacity: capacity ? Number(capacity) : demoEvents[index].capacity,
      status: status ?? demoEvents[index].status,
      imageUrl: imageUrl ?? demoEvents[index].imageUrl,
      categoryId: categoryId ? Number(categoryId) : demoEvents[index].categoryId,
      pembicaraId: pembicaraId ? Number(pembicaraId) : demoEvents[index].pembicaraId,
      updatedAt: new Date().toISOString(),
    };

    return res.json(getEventWithRelations(demoEvents[index]));
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Event berhasil dihapus.' });
  } catch (error) {
    const index = demoEvents.findIndex((item) => item.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Event tidak ditemukan.' });

    demoEvents.splice(index, 1);
    return res.json({ message: 'Event berhasil dihapus.' });
  }
};
