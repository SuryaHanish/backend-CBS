import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { cacheData, getCacheData, clearCache } from "../services/cache.service";

const CATEGORY_CACHE_TTL = 3600; // 1 hour cache TTL

// Type guard to narrow down 'unknown' to 'Error'
function isError(err: unknown): err is Error {
  return err instanceof Error;
}

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, subjectSlug, slug } = req.body;
    const category = await categoryService.createCategory(name, subjectSlug, slug);
    
    // Clear relevant cache entries
    await clearCache("all_categories");
    await clearCache(`subject_categories_${subjectSlug}`);
    
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
    // Try to get from cache first
    const cachedCategories = await getCacheData("all_categories");
    if (cachedCategories) {
      return res.status(200).json({ categories: cachedCategories });
    }

    // If not in cache, get from database
    const categories = await categoryService.getAllCategories();
    
    // Cache the results
    await cacheData("all_categories", categories, CATEGORY_CACHE_TTL);
    
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
    
    // Try to get from cache first
    const cachedCategories = await getCacheData(`subject_categories_${subjectSlug}`);
    if (cachedCategories) {
      return res.status(200).json({ categories: cachedCategories });
    }

    // If not in cache, get from database
    const categories = await categoryService.getCategoriesBySubjectSlug(subjectSlug);
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for the given subject' });
    }

    // Cache the results
    await cacheData(`subject_categories_${subjectSlug}`, categories, CATEGORY_CACHE_TTL);
    
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

    // Try to get from cache first
    const cachedCategory = await getCacheData(`category_${slug}`);
    if (cachedCategory) {
      return res.status(200).json({ category: cachedCategory });
    }

    // If not in cache, get from database
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Cache the results
    await cacheData(`category_${slug}`, category, CATEGORY_CACHE_TTL);
    
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

    // Clear relevant cache entries
    await clearCache(`category_${slug}`);
    await clearCache("all_categories");
    await clearCache(`subject_categories_${subjectSlug}`);
    /* Also clear old subject categories if subject changed
    if (updatedCategory.oldSubjectSlug && updatedCategory.oldSubjectSlug !== subjectSlug) {
      await clearCache(`subject_categories_${updatedCategory.oldSubjectSlug}`);
    }*/
    
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

    // Clear relevant cache entries
    await clearCache(`category_${slug}`);
    await clearCache("all_categories");
    await clearCache(`subject_categories_${category.subjectSlug}`);
    
    res.status(200).json({ message: 'Category and associated topics deleted successfully' });
  } catch (err) {
    if (isError(err)) {
      res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
  }
};