"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = exports.BlogController = void 0;
const blog_service_1 = require("../services/blog.service");
const error_1 = require("../middleware/error");
const cache_service_1 = require("../services/cache.service");
const BLOG_CACHE_TTL = 3600; // 1 hour for blog data cache
class BlogController {
    // Create a new blog
    async createBlog(req, res) {
        try {
            const { title, content, metadata } = req.body;
            if (!title || !content || content.length === 0) {
                throw new error_1.BadRequestError("Title and content are required");
            }
            const newBlog = await blog_service_1.blogService.createBlog({
                title,
                content,
                metadata,
                slug: "",
            });
            // Clear blog list cache since a new blog was added
            await (0, cache_service_1.clearCache)("all_blogs");
            return res.status(201).json(newBlog);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    // Get a blog by its slug
    async getBlogBySlug(req, res) {
        try {
            const { slug } = req.params;
            // Attempt to retrieve cached blog data
            const cachedBlog = await (0, cache_service_1.getCacheData)(`blog_${slug}`);
            if (cachedBlog) {
                return res.status(200).json(cachedBlog);
            }
            // Fetch from database if not in cache
            const blog = await blog_service_1.blogService.getBlogBySlug(slug);
            // Cache the result for future requests
            await (0, cache_service_1.cacheData)(`blog_${slug}`, blog, BLOG_CACHE_TTL);
            return res.status(200).json(blog);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    // Get all blogs
    async getAllBlogs(req, res) {
        try {
            const cachedBlogs = await (0, cache_service_1.getCacheData)("all_blogs");
            if (cachedBlogs) {
                return res.status(200).json(cachedBlogs);
            }
            const blogs = await blog_service_1.blogService.getAllBlogs();
            // Cache the result for future requests
            await (0, cache_service_1.cacheData)("all_blogs", blogs, BLOG_CACHE_TTL);
            return res.status(200).json(blogs);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    // Update a blog by its slug
    async updateBlog(req, res) {
        try {
            const { slug } = req.params;
            const blogData = req.body;
            const updatedBlog = await blog_service_1.blogService.updateBlog(slug, blogData);
            // Clear cache for this blog and the blog list
            await (0, cache_service_1.clearCache)(`blog_${slug}`);
            await (0, cache_service_1.clearCache)("all_blogs");
            return res.status(200).json(updatedBlog);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    // Delete a blog by its slug
    async deleteBlog(req, res) {
        try {
            const { slug } = req.params;
            await blog_service_1.blogService.deleteBlog(slug);
            // Clear cache for this blog and the blog list
            await (0, cache_service_1.clearCache)(`blog_${slug}`);
            await (0, cache_service_1.clearCache)("all_blogs");
            return res.status(204).send();
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    // Error handling method
    handleError(error, res) {
        if (error instanceof error_1.BadRequestError) {
            return res.status(400).json({ message: error.message });
        }
        if (error instanceof error_1.NotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof Error) {
            return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(500).json({ message: "Unknown error occurred" });
    }
}
exports.BlogController = BlogController;
// Export controller instance for use in routes
exports.blogController = new BlogController();
