import { Request, Response } from "express";
import { TopicService } from "../services/topic.service";
import { blogService } from "../services/blog.service";
import { cacheData, getCacheData, clearCache } from "../services/cache.service";

const TOPIC_CACHE_TTL = 3600; // 1 hour cache TTL

// Type guard for narrowing the 'unknown' type to an Error
function isError(err: unknown): err is Error {
  return err instanceof Error;
}

export const TopicController = {
  // Create a new topic
  createTopic: async (req: Request, res: Response) => {
    try {
      const { name, categorySlug, blogSlug, slug } = req.body;
      const topic = await TopicService.createTopic(
        name,
        categorySlug,
        blogSlug,
        slug
      );

      // Clear relevant caches
      await clearCache("all_topics");
      await clearCache(`category_topics_${categorySlug}`);
      await clearCache(`topic_search_results`);
      
      res.status(201).json({ message: "Topic created successfully", topic });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({ message: "Error creating topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Get all topics
  getAllTopics: async (req: Request, res: Response) => {
    try {
      // Try to get from cache first
      const cachedTopics = await getCacheData("all_topics");
      if (cachedTopics) {
        return res.status(200).json({ topics: cachedTopics });
      }

      const topics = await TopicService.getAllTopics();
      
      // Cache the results
      await cacheData("all_topics", topics, TOPIC_CACHE_TTL);
      
      res.status(200).json({ topics });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({ message: "Error fetching topics", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Search topics dynamically
  searchTopics: async (req: Request, res: Response) => {
    try {
      const { keyword } = req.query;
      
      if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({ message: "Keyword is required for search" });
      }

      // Try to get from cache first using keyword as part of the cache key
      const cacheKey = `topic_search_${keyword.toLowerCase()}`;
      const cachedResults = await getCacheData(cacheKey);
      if (cachedResults) {
        return res.status(200).json({ 
          topics: cachedResults,
          message: cachedResults.length === 0 ? "No topics found matching the keyword" : undefined
        });
      }

      const topics = await TopicService.searchTopics(keyword);

      // Cache the search results with a shorter TTL since search results may change more frequently
      await cacheData(cacheKey, topics, TOPIC_CACHE_TTL / 2);

      return res.status(200).json({ 
        topics: topics || [],
        message: topics.length === 0 ? "No topics found matching the keyword" : undefined
      });
    } catch (err) {
      if (isError(err)) {
        console.error('Search topics error:', err.message);
        return res.status(500).json({ message: "Error searching topics", error: err.message });
      }
      console.error('Unknown search error:', err);
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  },

  // Get a single topic by slug
  getTopicBySlug: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      // Try to get from cache first
      const cachedTopic = await getCacheData(`topic_${slug}`);
      if (cachedTopic) {
        return res.status(200).json({ topic: cachedTopic });
      }

      const topic = await TopicService.getTopicBySlug(slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Cache the result
      await cacheData(`topic_${slug}`, topic, TOPIC_CACHE_TTL);
      
      res.status(200).json({ topic });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({ message: "Error fetching topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Update a topic by slug
  updateTopic: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { name, categorySlug, blogSlug } = req.body;
      const updatedTopic = await TopicService.updateTopic(
        slug,
        name,
        categorySlug,
        blogSlug
      );
      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Clear relevant caches
      await clearCache(`topic_${slug}`);
      await clearCache("all_topics");
      await clearCache(`category_topics_${categorySlug}`);
      /* Clear old category cache if category changed
      if (updatedTopic.oldCategorySlug && updatedTopic.oldCategorySlug !== categorySlug) {
        await clearCache(`category_topics_${updatedTopic.oldCategorySlug}`);
      }*/
      // Clear search results cache as update might affect search results
      await clearCache(`topic_search_results`);
      
      res.status(200).json({ message: "Topic updated successfully", updatedTopic });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({ message: "Error updating topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Get all topics by categorySlug
  getTopicsByCategory: async (req: Request, res: Response) => {
    try {
      const { categorySlug } = req.body;

      // Try to get from cache first
      const cachedTopics = await getCacheData(`category_topics_${categorySlug}`);
      if (cachedTopics) {
        return res.status(200).json({ topics: cachedTopics });
      }

      const topics = await TopicService.getTopicsByCategory(categorySlug);
      if (!topics || topics.length === 0) {
        return res.status(404).json({ message: "No topics found for the given category" });
      }

      // Cache the results
      await cacheData(`category_topics_${categorySlug}`, topics, TOPIC_CACHE_TTL);
      
      res.status(200).json({ topics });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({ message: "Error fetching topics by category", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Delete a topic by slug (also deletes associated blog)
  deleteTopic: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const topic = await TopicService.getTopicBySlug(slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Delete associated blog if exists
      if (topic.blogSlug) {
        await blogService.deleteBlog(topic.blogSlug);
        // Clear blog cache
        await clearCache(`blog_${topic.blogSlug}`);
        await clearCache("all_blogs");
      }

      await TopicService.deleteTopic(slug);

      // Clear relevant caches
      await clearCache(`topic_${slug}`);
      await clearCache("all_topics");
      await clearCache(`category_topics_${topic.categorySlug}`);
      await clearCache(`topic_search_results`);
      
      res.status(200).json({ message: "Topic and associated blog deleted successfully" });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({ message: "Error deleting topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },
};