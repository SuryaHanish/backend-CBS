"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = exports.BlogServiceImpl = void 0;
const database_service_1 = require("../services/database.service"); // Assume a database service is available
const error_1 = require("../middleware/error"); // Custom error handlers
const nanoid_1 = require("nanoid"); // Optional: You can use nanoid for generating a unique slug
class BlogServiceImpl {
    constructor() {
        this.database = new database_service_1.DatabaseService(); // Assume a DB service is available
    }
    // Create a new blog
    async createBlog(blogData) {
        const { title, content, metadata } = blogData;
        // Ensure content is not empty
        if (!content || content.length === 0) {
            throw new error_1.BadRequestError("Blog content cannot be empty");
        }
        // Ensure metadata has the required fields
        if (!metadata || !metadata.author || !metadata.publishDate) {
            throw new error_1.BadRequestError("Blog metadata must include author and publishDate");
        }
        // Generate a unique slug if it is not provided (using nanoid here, or you could generate it differently)
        const slug = blogData.slug || (0, nanoid_1.nanoid)(); // Default to a new generated slug if slug is not provided
        // If metadata is missing optional fields, assign default values
        const completeMetadata = {
            author: metadata.author,
            publishDate: metadata.publishDate,
            lastUpdated: metadata.lastUpdated || undefined, // Use undefined instead of null
            tags: metadata.tags || [],
            readingTime: metadata.readingTime || undefined, // Use undefined instead of null
            difficulty: metadata.difficulty || "beginner", // Default to "beginner"
            categorySlug: metadata.categorySlug
        };
        // Save the blog to the database with the generated slug
        const newBlog = await this.database.saveBlog({
            slug,
            title,
            content,
            metadata: completeMetadata,
        });
        return newBlog;
    }
    // Fetch a blog by its slug
    async getBlogBySlug(slug) {
        const blog = await this.database.getBlogBySlug(slug);
        if (!blog) {
            throw new error_1.NotFoundError("Blog not found");
        }
        return blog;
    }
    // Get all blogs
    async getAllBlogs() {
        return await this.database.getAllBlogs();
    }
    // Update a blog's content or metadata
    async updateBlog(slug, blogData) {
        const existingBlog = await this.database.getBlogBySlug(slug);
        if (!existingBlog) {
            throw new error_1.NotFoundError("Blog not found");
        }
        // Update only the fields passed in the blogData
        const updatedBlog = await this.database.updateBlog(slug, blogData);
        return updatedBlog;
    }
    // Delete a blog by its slug
    async deleteBlog(slug) {
        const existingBlog = await this.database.getBlogBySlug(slug);
        if (!existingBlog) {
            throw new error_1.NotFoundError("Blog not found");
        }
        await this.database.deleteBlog(slug);
    }
}
exports.BlogServiceImpl = BlogServiceImpl;
exports.blogService = new BlogServiceImpl();
