import { Router, Request, Response, NextFunction } from "express";
import { TopicController } from "../controllers/topic.controller";

// Helper to wrap async functions
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

// Route to create a new topic
router.post("/topics", asyncHandler((req: Request, res: Response) => TopicController.createTopic(req, res)));

// Route to get all topics
router.get("/topics", asyncHandler((req: Request, res: Response) => TopicController.getAllTopics(req, res)));

// Route to get a topic by its slug
router.get("/topic/:slug", asyncHandler((req: Request, res: Response) => TopicController.getTopicBySlug(req, res)));

// Route to update a topic by its slug
router.put("/topic/:slug", asyncHandler((req: Request, res: Response) => TopicController.updateTopic(req, res)));

// Route to delete a topic by its slug
router.delete("/topic/:slug", asyncHandler((req: Request, res: Response) => TopicController.deleteTopic(req, res)));

export default router;
