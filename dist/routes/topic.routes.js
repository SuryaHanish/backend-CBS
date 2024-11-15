"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
router.get("/topic/:slug", asyncHandler((req, res) => topic_controller_1.TopicController.getTopicBySlug(req, res)));
// Route to update a topic by its slug
router.put("/topic/:slug", asyncHandler((req, res) => topic_controller_1.TopicController.updateTopic(req, res)));
// Route to delete a topic by its slug
router.delete("/topic/:slug", asyncHandler((req, res) => topic_controller_1.TopicController.deleteTopic(req, res)));
exports.default = router;
