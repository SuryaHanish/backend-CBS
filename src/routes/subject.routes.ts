import { Router, Request, Response, NextFunction } from "express";
import * as subjectController from "../controllers/subject.controller";

const router = Router();

// Helper to wrap async functions
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Route to create a new subject
router.post(
  "/subjects",
  asyncHandler((req: Request, res: Response) => subjectController.createSubject(req, res))
);

// Route to get all subjects
router.get(
  "/subjects",
  asyncHandler((req: Request, res: Response) => subjectController.getSubjects(req, res))
);

// Route to get a subject by slug
router.get(
  "/subjects/:slug",
  asyncHandler((req: Request, res: Response) => subjectController.getSubjectBySlug(req, res))
);

// Route to update a subject by slug
router.put(
  "/subjects/:slug",
  asyncHandler((req: Request, res: Response) => subjectController.updateSubject(req, res))
);

// Route to delete a subject by slug
router.delete(
  "/subjects/:slug",
  asyncHandler((req: Request, res: Response) => subjectController.deleteSubject(req, res))
);

export default router;
