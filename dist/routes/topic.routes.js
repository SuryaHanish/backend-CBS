"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/topic.route.ts
const express_1 = require("express");
const topic_controller_1 = require("../controllers/topic.controller");
// Helper to wrap async functions
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const router = (0, express_1.Router)();
// Route to create a new topic
router.post("/topics", asyncHandler((req, res) => topic_controller_1.TopicController.createTopic(req, res)));
// Route to get all topics
router.get("/topics", asyncHandler((req, res) => topic_controller_1.TopicController.getAllTopics(req, res)));
// Route to get a topic by its slug
router.get("/blog/:slug", asyncHandler((req, res) => topic_controller_1.TopicController.getTopicBySlug(req, res)));
// Route to update a topic by its slug
router.put("/topic/:slug", asyncHandler((req, res) => topic_controller_1.TopicController.updateTopic(req, res)));
// Route to search topics by keyword (dynamic and static)
router.get("/topics/search", asyncHandler((req, res) => topic_controller_1.TopicController.searchTopics(req, res)));
// Route to get topics by categorySlug from the request body
router.post("/topics/category", asyncHandler((req, res) => topic_controller_1.TopicController.getTopicsByCategory(req, res)));
// Route to delete a topic by its slug
router.delete("/topic/:slug", asyncHandler((req, res) => topic_controller_1.TopicController.deleteTopic(req, res)));
exports.default = router;
