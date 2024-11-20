import { Request, Response } from "express";
import { TopicService } from "../services/topic.service";
import { blogService } from "../services/blog.service";

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
      res.status(201).json({ message: "Topic created successfully", topic });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "Error creating topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Get all topics
  getAllTopics: async (req: Request, res: Response) => {
    try {
      const topics = await TopicService.getAllTopics();
      res.status(200).json({ topics });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "Error fetching topics", error: err.message });
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
        return res
          .status(400)
          .json({ message: "Keyword is required for search" });
      }

      const topics = await TopicService.searchTopics(keyword);

      // Return empty array instead of 404 when no results found
      return res.status(200).json({ 
        topics: topics || [],
        message: topics.length === 0 ? "No topics found matching the keyword" : undefined
      });

    } catch (err) {
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
  getTopicBySlug: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const topic = await TopicService.getTopicBySlug(slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.status(200).json({ topic });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "Error fetching topic", error: err.message });
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
      res
        .status(200)
        .json({ message: "Topic updated successfully", updatedTopic });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "Error updating topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },

  // Get all topics by categorySlug
  getTopicsByCategory: async (req: Request, res: Response) => {
    try {
      const { categorySlug } = req.body; // Retrieve categorySlug from the request body
      const topics = await TopicService.getTopicsByCategory(categorySlug);
      if (!topics || topics.length === 0) {
        return res
          .status(404)
          .json({ message: "No topics found for the given category" });
      }
      res.status(200).json({ topics });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res.status(500).json({
          message: "Error fetching topics by category",
          error: err.message,
        });
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

      // Check if the topic is associated with a blog and delete the blog
      if (topic.blogSlug) {
        await blogService.deleteBlog(topic.blogSlug); // Deleting associated blog
      }

      await TopicService.deleteTopic(slug); // Delete the topic
      res
        .status(200)
        .json({ message: "Topic and associated blog deleted successfully" });
    } catch (err) {
      if (isError(err)) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "Error deleting topic", error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  },
};
