"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryBySlug = exports.getAllCategories = exports.createCategory = void 0;
// services/category.service.ts
const category_model_1 = __importDefault(require("../models/category.model"));
const topic_model_1 = __importDefault(require("../models/topic.model"));
const topic_service_1 = require("./topic.service");
const blog_service_1 = require("./blog.service");
// Create a new category
const createCategory = async (name, subjectSlug, slug) => {
    const category = new category_model_1.default({ name, subjectSlug, slug });
    return category.save();
};
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = async () => {
    return category_model_1.default.find();
};
exports.getAllCategories = getAllCategories;
// Get a category by its slug
const getCategoryBySlug = async (slug) => {
    return category_model_1.default.findOne({ slug });
};
exports.getCategoryBySlug = getCategoryBySlug;
// Update a category by slug
const updateCategory = async (slug, name, subjectSlug) => {
    return category_model_1.default.findOneAndUpdate({ slug }, { name, subjectSlug }, { new: true } // Return the updated document
    );
};
exports.updateCategory = updateCategory;
// Delete a category by slug and its associated topics and blogs
const deleteCategory = async (slug) => {
    // Find the category to delete
    const category = await category_model_1.default.findOneAndDelete({ slug });
    if (category) {
        // Find all topics related to this category
        const topics = await topic_model_1.default.find({ categorySlug: slug });
        for (const topic of topics) {
            // Delete each topic using the TopicService
            if (topic.blogSlug) {
                await blog_service_1.blogService.deleteBlog(topic.blogSlug); // Deleting associated blog
            }
            await topic_service_1.TopicService.deleteTopic(topic.slug); // Delete the topic
        }
    }
    return category;
};
exports.deleteCategory = deleteCategory;
