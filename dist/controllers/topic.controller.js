"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicController = void 0;
const topic_service_1 = require("../services/topic.service");
const blog_service_1 = require("../services/blog.service");
const cache_service_1 = require("../services/cache.service");
const TOPIC_CACHE_TTL = 3600; // 1 hour cache TTL
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
            // Clear relevant caches
            await (0, cache_service_1.clearCache)("all_topics");
            await (0, cache_service_1.clearCache)(`category_topics_${categorySlug}`);
            await (0, cache_service_1.clearCache)(`topic_search_results`);
            res.status(201).json({ message: "Topic created successfully", topic });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({ message: "Error creating topic", error: err.message });
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
            // Try to get from cache first
            const cachedTopics = await (0, cache_service_1.getCacheData)("all_topics");
            if (cachedTopics) {
                return res.status(200).json({ topics: cachedTopics });
            }
            const topics = await topic_service_1.TopicService.getAllTopics();
            // Cache the results
            await (0, cache_service_1.cacheData)("all_topics", topics, TOPIC_CACHE_TTL);
            res.status(200).json({ topics });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({ message: "Error fetching topics", error: err.message });
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
                return res.status(400).json({ message: "Keyword is required for search" });
            }
            // Try to get from cache first using keyword as part of the cache key
            const cacheKey = `topic_search_${keyword.toLowerCase()}`;
            const cachedResults = await (0, cache_service_1.getCacheData)(cacheKey);
            if (cachedResults) {
                return res.status(200).json({
                    topics: cachedResults,
                    message: cachedResults.length === 0 ? "No topics found matching the keyword" : undefined
                });
            }
            const topics = await topic_service_1.TopicService.searchTopics(keyword);
            // Cache the search results with a shorter TTL since search results may change more frequently
            await (0, cache_service_1.cacheData)(cacheKey, topics, TOPIC_CACHE_TTL / 2);
            return res.status(200).json({
                topics: topics || [],
                message: topics.length === 0 ? "No topics found matching the keyword" : undefined
            });
        }
        catch (err) {
            if (isError(err)) {
                console.error('Search topics error:', err.message);
                return res.status(500).json({ message: "Error searching topics", error: err.message });
            }
            console.error('Unknown search error:', err);
            return res.status(500).json({ message: "Unknown error occurred" });
        }
    },
    // Get a single topic by slug
    getTopicBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            // Try to get from cache first
            const cachedTopic = await (0, cache_service_1.getCacheData)(`topic_${slug}`);
            if (cachedTopic) {
                return res.status(200).json({ topic: cachedTopic });
            }
            const topic = await topic_service_1.TopicService.getTopicBySlug(slug);
            if (!topic) {
                return res.status(404).json({ message: "Topic not found" });
            }
            // Cache the result
            await (0, cache_service_1.cacheData)(`topic_${slug}`, topic, TOPIC_CACHE_TTL);
            res.status(200).json({ topic });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({ message: "Error fetching topic", error: err.message });
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
            // Clear relevant caches
            await (0, cache_service_1.clearCache)(`topic_${slug}`);
            await (0, cache_service_1.clearCache)("all_topics");
            await (0, cache_service_1.clearCache)(`category_topics_${categorySlug}`);
            /* Clear old category cache if category changed
            if (updatedTopic.oldCategorySlug && updatedTopic.oldCategorySlug !== categorySlug) {
              await clearCache(`category_topics_${updatedTopic.oldCategorySlug}`);
            }*/
            // Clear search results cache as update might affect search results
            await (0, cache_service_1.clearCache)(`topic_search_results`);
            res.status(200).json({ message: "Topic updated successfully", updatedTopic });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({ message: "Error updating topic", error: err.message });
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
            const { categorySlug } = req.body;
            // Try to get from cache first
            const cachedTopics = await (0, cache_service_1.getCacheData)(`category_topics_${categorySlug}`);
            if (cachedTopics) {
                return res.status(200).json({ topics: cachedTopics });
            }
            const topics = await topic_service_1.TopicService.getTopicsByCategory(categorySlug);
            if (!topics || topics.length === 0) {
                return res.status(404).json({ message: "No topics found for the given category" });
            }
            // Cache the results
            await (0, cache_service_1.cacheData)(`category_topics_${categorySlug}`, topics, TOPIC_CACHE_TTL);
            res.status(200).json({ topics });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({ message: "Error fetching topics by category", error: err.message });
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
            // Delete associated blog if exists
            if (topic.blogSlug) {
                await blog_service_1.blogService.deleteBlog(topic.blogSlug);
                // Clear blog cache
                await (0, cache_service_1.clearCache)(`blog_${topic.blogSlug}`);
                await (0, cache_service_1.clearCache)("all_blogs");
            }
            await topic_service_1.TopicService.deleteTopic(slug);
            // Clear relevant caches
            await (0, cache_service_1.clearCache)(`topic_${slug}`);
            await (0, cache_service_1.clearCache)("all_topics");
            await (0, cache_service_1.clearCache)(`category_topics_${topic.categorySlug}`);
            await (0, cache_service_1.clearCache)(`topic_search_results`);
            res.status(200).json({ message: "Topic and associated blog deleted successfully" });
        }
        catch (err) {
            if (isError(err)) {
                console.error(err.message);
                res.status(500).json({ message: "Error deleting topic", error: err.message });
            }
            else {
                console.error(err);
                res.status(500).json({ message: "Unknown error occurred" });
            }
        }
    },
};
