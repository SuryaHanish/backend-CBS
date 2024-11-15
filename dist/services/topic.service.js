"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicService = void 0;
//services/topic.service.ts
const topic_model_1 = __importDefault(require("../models/topic.model"));
class TopicService {
    // Create a new topic
    static async createTopic(name, categorySlug, blogSlug, slug) {
        const topic = new topic_model_1.default({
            name,
            categorySlug,
            blogSlug,
            slug,
        });
        return await topic.save();
    }
    // Get all topics
    static async getAllTopics() {
        return await topic_model_1.default.find();
    }
    // Get a topic by slug
    static async getTopicBySlug(slug) {
        return await topic_model_1.default.findOne({ slug });
    }
    // Update a topic by slug
    static async updateTopic(slug, name, categorySlug, blogSlug) {
        return await topic_model_1.default.findOneAndUpdate({ slug }, { name, categorySlug, blogSlug }, { new: true } // Return the updated document
        );
    }
    // Delete a topic by slug
    static async deleteTopic(slug) {
        return await topic_model_1.default.findOneAndDelete({ slug });
    }
}
exports.TopicService = TopicService;
