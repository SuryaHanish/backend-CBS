"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicController = void 0;
const topic_service_1 = require("../services/topic.service");
const blog_service_1 = require("../services/blog.service");
// Type guard for narrowing the 'unknown' type to an Error
function isError(err) {
    return err instanceof Error;
}
exports.TopicController = {
    // Create a new topic
    createTopic: async (req, res) => {
        try {
            const { name, categorySlug, blogSlug, slug } = req.body;
            const topic = await topic_service_1.TopicService.createTopic(name, categorySlug, blogSlug, slug);
            res.status(201).json({ message: "Topic created successfully", topic });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res
                    .status(500)
                    .json({ message: "Error creating topic", error: err.message });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
    // Get all topics
    getAllTopics: async (req, res) => {
        try {
            const topics = await topic_service_1.TopicService.getAllTopics();
            res.status(200).json({ topics });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res
                    .status(500)
                    .json({ message: "Error fetching topics", error: err.message });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
    // Search topics dynamically
    searchTopics: async (req, res) => {
        try {
            const { keyword } = req.query;
            if (!keyword || typeof keyword !== 'string') {
                return res
                    .status(400)
                    .json({ message: "Keyword is required for search" });
            }
            const topics = await topic_service_1.TopicService.searchTopics(keyword);
            // Return empty array instead of 404 when no results found
            return res.status(200).json({
                topics: topics || [],
                message: topics.length === 0 ? "No topics found matching the keyword" : undefined
            });
        }
        catch (err) {
            if (isError(err)) {
                console.error('Search topics error:', err.message);
                return res
                    .status(500)
                    .json({ message: "Error searching topics", error: err.message });
            }
            console.error('Unknown search error:', err);
            return res.status(500).json({ message: "Unknown error occurred" });
        }
    },
    // Get a single topic by slug
    getTopicBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            const topic = await topic_service_1.TopicService.getTopicBySlug(slug);
            if (!topic) {
                return res.status(404).json({ message: "Topic not found" });
            }
            res.status(200).json({ topic });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res
                    .status(500)
                    .json({ message: "Error fetching topic", error: err.message });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
    // Update a topic by slug
    updateTopic: async (req, res) => {
        try {
            const { slug } = req.params;
            const { name, categorySlug, blogSlug } = req.body;
            const updatedTopic = await topic_service_1.TopicService.updateTopic(slug, name, categorySlug, blogSlug);
            if (!updatedTopic) {
                return res.status(404).json({ message: "Topic not found" });
            }
            res
                .status(200)
                .json({ message: "Topic updated successfully", updatedTopic });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res
                    .status(500)
                    .json({ message: "Error updating topic", error: err.message });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
    // Get all topics by categorySlug
    getTopicsByCategory: async (req, res) => {
        try {
            const { categorySlug } = req.body; // Retrieve categorySlug from the request body
            const topics = await topic_service_1.TopicService.getTopicsByCategory(categorySlug);
            if (!topics || topics.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No topics found for the given category" });
            }
            res.status(200).json({ topics });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({
                    message: "Error fetching topics by category",
                    error: err.message,
                });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
    // Delete a topic by slug (also deletes associated blog)
    deleteTopic: async (req, res) => {
        try {
            const { slug } = req.params;
            const topic = await topic_service_1.TopicService.getTopicBySlug(slug);
            if (!topic) {
                return res.status(404).json({ message: "Topic not found" });
            }
            // Check if the topic is associated with a blog and delete the blog
            if (topic.blogSlug) {
                await blog_service_1.blogService.deleteBlog(topic.blogSlug); // Deleting associated blog
            }
            await topic_service_1.TopicService.deleteTopic(slug); // Delete the topic
            res
                .status(200)
                .json({ message: "Topic and associated blog deleted successfully" });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res
                    .status(500)
                    .json({ message: "Error deleting topic", error: err.message });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
};
