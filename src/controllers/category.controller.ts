// controllers/category.controller.ts
import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

// Type guard to narrow down 'unknown' to 'Error'
function isError(err: unknown): err is Error {
  return err instanceof Error;
}

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, subjectSlug, slug } = req.body;
    const category = await categoryService.createCategory(name, subjectSlug, slug);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error creating category', error: err.message });
    }
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
  }
};

// Get all categories by subjectSlug
export const getCategoriesBySubjectSlug = async (req: Request, res: Response) => {
  try {
    const { subjectSlug } = req.params;
    const categories = await categoryService.getCategoriesBySubjectSlug(subjectSlug);
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for the given subject' });
    }
    res.status(200).json({ categories });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error fetching categories by subjectSlug', error: err.message });
    }
  }
};

// Get a category by its slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error fetching category', error: err.message });
    }
  }
};

// Update a category by slug
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { name, subjectSlug } = req.body;
    const updatedCategory = await categoryService.updateCategory(slug, name, subjectSlug);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error updating category', error: err.message });
    }
  }
};

// Delete a category by slug
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.deleteCategory(slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category and associated topics deleted successfully' });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
  }
};
