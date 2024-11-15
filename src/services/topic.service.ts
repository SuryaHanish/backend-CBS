//services/topic.service.ts
import Topic from "../models/topic.model";

export class TopicService {
  // Create a new topic
  static async createTopic(name: string, categorySlug: string, blogSlug?: string,slug?:string) {
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

  // Get a topic by slug
  static async getTopicBySlug(slug: string) {
    return await Topic.findOne({ slug });
  }

  // Update a topic by slug
  static async updateTopic(slug: string, name: string, categorySlug: string, blogSlug?: string) {
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
