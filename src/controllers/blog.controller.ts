// controllers/blog.controller.ts
import { Request, Response } from "express";
import { blogService } from "../services/blog.service";
import { BadRequestError, NotFoundError } from "../middleware/error";
import { cacheData, getCacheData, clearCache } from "../services/cache.service";

const BLOG_CACHE_TTL = 3600; // 1 hour for blog data cache

export class BlogController {
  // Create a new blog
  async createBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { title, content, metadata }: { title: string, content: any[], metadata: any } = req.body;
      if (!title || !content || content.length === 0) {
        throw new BadRequestError("Title and content are required");
      }

      const newBlog = await blogService.createBlog({
        title,
        content,
        metadata,
        slug: "",
      });

      // Clear blog list cache since a new blog was added
      await clearCache("all_blogs");

      return res.status(201).json(newBlog);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  // Get a blog by its slug
  async getBlogBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const { slug } = req.params;

      // Attempt to retrieve cached blog data
      const cachedBlog = await getCacheData(`blog_${slug}`);
      if (cachedBlog) {
        return res.status(200).json(cachedBlog);
      }

      // Fetch from database if not in cache
      const blog = await blogService.getBlogBySlug(slug);

      // Cache the result for future requests
      await cacheData(`blog_${slug}`, blog, BLOG_CACHE_TTL);

      return res.status(200).json(blog);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  // Get all blogs
  async getAllBlogs(req: Request, res: Response): Promise<Response> {
    try {
      const cachedBlogs = await getCacheData("all_blogs");
      if (cachedBlogs) {
        return res.status(200).json(cachedBlogs);
      }

      const blogs = await blogService.getAllBlogs();

      // Cache the result for future requests
      await cacheData("all_blogs", blogs, BLOG_CACHE_TTL);

      return res.status(200).json(blogs);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  // Update a blog by its slug
  async updateBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { slug } = req.params;
      const blogData: Partial<{ title: string, content: any[], metadata: any }> = req.body;

      const updatedBlog = await blogService.updateBlog(slug, blogData);

      // Clear cache for this blog and the blog list
      await clearCache(`blog_${slug}`);
      await clearCache("all_blogs");

      return res.status(200).json(updatedBlog);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  // Delete a blog by its slug
  async deleteBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { slug } = req.params;
      await blogService.deleteBlog(slug);

      // Clear cache for this blog and the blog list
      await clearCache(`blog_${slug}`);
      await clearCache("all_blogs");

      return res.status(204).send();
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  // Error handling method
  private handleError(error: unknown, res: Response): Response {
    if (error instanceof BadRequestError) {
      return res.status(400).json({ message: error.message });
    }

    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(500).json({ message: "Unknown error occurred" });
  }
}

// Export controller instance for use in routes
export const blogController = new BlogController();
