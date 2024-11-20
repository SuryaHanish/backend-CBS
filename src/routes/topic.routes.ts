//src/routes/topic.route.ts
import { Router, Request, Response, NextFunction } from "express";
import { TopicController } from "../controllers/topic.controller";

// Helper to wrap async functions
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

// Route to create a new topic
router.post(
  "/topics",
  asyncHandler((req: Request, res: Response) =>
    TopicController.createTopic(req, res)
  )
);

// Route to get all topics
router.get(
  "/topics",
  asyncHandler((req: Request, res: Response) =>
    TopicController.getAllTopics(req, res)
  )
);

// Route to get a topic by its slug
router.get(
  "/blog/:slug",
  asyncHandler((req: Request, res: Response) =>
    TopicController.getTopicBySlug(req, res)
  )
);

// Route to update a topic by its slug
router.put(
  "/topic/:slug",
  asyncHandler((req: Request, res: Response) =>
    TopicController.updateTopic(req, res)
  )
);

// Route to search topics by keyword (dynamic and static)
router.get(
  "/topics/search",
  asyncHandler((req: Request, res: Response) =>
    TopicController.searchTopics(req, res)
  )
);

// Route to get topics by categorySlug from the request body
router.post(
  "/topics/category",
  asyncHandler((req: Request, res: Response) =>
    TopicController.getTopicsByCategory(req, res)
  )
);

// Route to delete a topic by its slug
router.delete(
  "/topic/:slug",
  asyncHandler((req: Request, res: Response) =>
    TopicController.deleteTopic(req, res)
  )
);

export default router;
