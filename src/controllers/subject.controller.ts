import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service';
import { cacheData, getCacheData, clearCache } from "../services/cache.service";

const SUBJECT_CACHE_TTL = 86400; // 1 hour cache TTL

// Create a new subject
export const createSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const subject = await subjectService.createSubject(req.body);
    
    // Clear the subjects list cache since we added a new subject
    await clearCache("all_subjects");
    
    return res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating subject', error });
  }
};

// Get all subjects
export const getSubjects = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Try to get from cache first
    const cachedSubjects = await getCacheData("all_subjects");
    if (cachedSubjects) {
      return res.status(200).json(cachedSubjects);
    }

    // If not in cache, get from database
    const subjects = await subjectService.getSubjects();
    
    // Cache the results
    await cacheData("all_subjects", subjects, SUBJECT_CACHE_TTL);
    
    return res.status(200).json(subjects);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subjects', error });
  }
};

// Get a subject by slug
export const getSubjectBySlug = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { slug } = req.params;

    // Try to get from cache first
    const cachedSubject = await getCacheData(`subject_${slug}`);
    if (cachedSubject) {
      return res.status(200).json(cachedSubject);
    }

    // If not in cache, get from database
    const subject = await subjectService.getSubjectBySlug(slug);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Cache the results
    await cacheData(`subject_${slug}`, subject, SUBJECT_CACHE_TTL);
    
    return res.status(200).json(subject);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subject', error });
  }
};

// Update a subject by slug
export const updateSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { slug } = req.params;
    const updatedSubject = await subjectService.updateSubject(slug, req.body);
    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Clear relevant cache entries
    await clearCache(`subject_${slug}`);
    await clearCache("all_subjects");

    /* If the slug was updated, clear the old slug's cache as well
    if (updatedSubject.oldSlug && updatedSubject.oldSlug !== slug) {
      await clearCache(`subject_${updatedSubject.oldSlug}`);
      // Clear related category caches
      await clearCache(`subject_categories_${updatedSubject.oldSlug}`);
    }*/
    
    // Clear the new slug's category cache if it exists
    await clearCache(`subject_categories_${slug}`);
    
    return res.status(200).json(updatedSubject);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating subject', error });
  }
};

// Delete a subject by slug
export const deleteSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { slug } = req.params;
    const deletedSubject = await subjectService.deleteSubject(slug);
    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Clear relevant cache entries
    await clearCache(`subject_${slug}`);
    await clearCache("all_subjects");
    // Clear related category cache
    await clearCache(`subject_categories_${slug}`);
    // Clear the all categories cache since deleting a subject affects the category structure
    await clearCache("all_categories");
    
    return res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting subject', error });
  }
};