//routes/blog.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { blogController } from "../controllers/blog.controller";

const router = Router();

// Helper to wrap async functions
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Route to create a new blog
router.post("/blogs", asyncHandler((req: Request, res: Response) => blogController.createBlog(req, res)));

// Route to get a blog by its slug
router.get("/blogs/:slug", asyncHandler((req: Request, res: Response) => blogController.getBlogBySlug(req, res)));

// Route to get all blogs
router.get("/blogs", asyncHandler((req: Request, res: Response) => blogController.getAllBlogs(req, res)));

// Route to update a blog by its slug
router.put("/blogs/:slug", asyncHandler((req: Request, res: Response) => blogController.updateBlog(req, res)));

// Route to delete a blog by its slug
router.delete("/blogs/:slug", asyncHandler((req: Request, res: Response) => blogController.deleteBlog(req, res)));

export default router;
