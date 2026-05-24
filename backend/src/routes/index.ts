import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { getAllPembicara, getPembicaraById, createPembicara, updatePembicara, deletePembicara } from '../controllers/pembicaraController';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth
router.post('/auth/login', login);
router.post('/auth/register', register);

// Categories (protected)
router.get('/categories', authMiddleware, getAllCategories);
router.get('/categories/:id', authMiddleware, getCategoryById);
router.post('/categories', authMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

// Pembicara (protected)
router.get('/pembicara', authMiddleware, getAllPembicara);
router.get('/pembicara/:id', authMiddleware, getPembicaraById);
router.post('/pembicara', authMiddleware, createPembicara);
router.put('/pembicara/:id', authMiddleware, updatePembicara);
router.delete('/pembicara/:id', authMiddleware, deletePembicara);

// Events (protected)
router.get('/events', authMiddleware, getAllEvents);
router.get('/events/:id', authMiddleware, getEventById);
router.post('/events', authMiddleware, createEvent);
router.put('/events/:id', authMiddleware, updateEvent);
router.delete('/events/:id', authMiddleware, deleteEvent);

export default router;
