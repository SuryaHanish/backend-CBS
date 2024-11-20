//services/topic.service.ts
import Topic from "../models/topic.model";

export class TopicService {
  // Create a new topic
  static async createTopic(
    name: string,
    categorySlug: string,
    blogSlug?: string,
    slug?: string
  ) {
    const topic = new Topic({
      name,
      categorySlug,
      blogSlug,
      slug,
    });

    return await topic.save();
  }

  // Get all topics
  static async getAllTopics() {
    return await Topic.find();
  }

  // Find all topics by categorySlug
  static async getTopicsByCategory(categorySlug: string) {
    return await Topic.find({ categorySlug });
  }

  // Get a topic by slug
  static async getTopicBySlug(slug: string) {
    return await Topic.findOne({ slug });
  }

  // Search topics by keyword
  static async searchTopics(keyword: string) {
    try {
      // Escape special regex characters to prevent invalid regex patterns
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedKeyword, "i"); // Case-insensitive regex

      return await Topic.find({
        $or: [{ name: regex }, { slug: regex }, { categorySlug: regex }],
      }).limit(10); // Add limit to prevent too many results
    } catch (error) {
      console.error("TopicService search error:", error);
      throw error;
    }
  }

  // Update a topic by slug
  static async updateTopic(
    slug: string,
    name: string,
    categorySlug: string,
    blogSlug?: string
  ) {
    return await Topic.findOneAndUpdate(
      { slug },
      { name, categorySlug, blogSlug },
      { new: true } // Return the updated document
    );
  }

  // Delete a topic by slug
  static async deleteTopic(slug: string) {
    return await Topic.findOneAndDelete({ slug });
  }
}
