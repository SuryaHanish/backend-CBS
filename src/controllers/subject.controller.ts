import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service';

// Create a new subject
export const createSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const subject = await subjectService.createSubject(req.body);
    return res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating subject', error });
  }
};

// Get all subjects
export const getSubjects = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const subjects = await subjectService.getSubjects();
    return res.status(200).json(subjects);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subjects', error });
  }
};

// Get a subject by slug
export const getSubjectBySlug = async (req: Request, res: Response): Promise<Response> => {
  try {
    const subject = await subjectService.getSubjectBySlug(req.params.slug);
    if (subject) {
      return res.status(200).json(subject);
    }
    return res.status(404).json({ message: 'Subject not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subject', error });
  }
};

// Update a subject by slug
export const updateSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedSubject = await subjectService.updateSubject(req.params.slug, req.body);
    if (updatedSubject) {
      return res.status(200).json(updatedSubject);
    }
    return res.status(404).json({ message: 'Subject not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating subject', error });
  }
};

// Delete a subject by slug
export const deleteSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const deletedSubject = await subjectService.deleteSubject(req.params.slug);
    if (deletedSubject) {
      return res.status(200).json({ message: 'Subject deleted successfully' });
    }
    return res.status(404).json({ message: 'Subject not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting subject', error });
  }
};
