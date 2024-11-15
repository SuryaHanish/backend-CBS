// routes/category.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import * as categoryController from '../controllers/category.controller';

const router = Router();

// Helper to wrap async functions
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Route to create a new category
router.post('/categories', asyncHandler((req: Request, res: Response) => categoryController.createCategory(req, res)));

// Route to get all categories
router.get('/categories', asyncHandler((req: Request, res: Response) => categoryController.getAllCategories(req, res)));

// Route to get a category by its slug
router.get('/category/:slug', asyncHandler((req: Request, res: Response) => categoryController.getCategoryBySlug(req, res)));

// Route to update a category by its slug
router.put('/category/:slug', asyncHandler((req: Request, res: Response) => categoryController.updateCategory(req, res)));

// Route to delete a category by its slug
router.delete('/category/:slug', asyncHandler((req: Request, res: Response) => categoryController.deleteCategory(req, res)));

export default router;
