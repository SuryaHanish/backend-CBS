// services/blog.service.ts
import { Blog, ContentSection } from "../models/blog.model";
import { DatabaseService } from "../services/database.service"; // Assume a database service is available
import { BadRequestError, NotFoundError } from "../middleware/error"; // Custom error handlers
import { nanoid } from "nanoid"; // Optional: You can use nanoid for generating a unique slug

// Interface for the service functions
interface BlogService {
  createBlog(blogData: Blog): Promise<Blog>;
  getBlogBySlug(slug: string): Promise<Blog>;
  getAllBlogs(): Promise<Blog[]>;
  updateBlog(slug: string, blogData: Partial<Blog>): Promise<Blog>;
  deleteBlog(slug: string): Promise<void>;
}

export class BlogServiceImpl implements BlogService {
  private database: DatabaseService;

  constructor() {
    this.database = new DatabaseService(); // Assume a DB service is available
  }

  // Create a new blog
  async createBlog(blogData: Blog): Promise<Blog> {
    const { title, content, metadata } = blogData;
  
    // Ensure content is not empty
    if (!content || content.length === 0) {
      throw new BadRequestError("Blog content cannot be empty");
    }
  
    // Ensure metadata has the required fields
    if (!metadata || !metadata.author || !metadata.publishDate) {
      throw new BadRequestError("Blog metadata must include author and publishDate");
    }
  
    // Generate a unique slug if it is not provided (using nanoid here, or you could generate it differently)
    const slug = blogData.slug || nanoid(); // Default to a new generated slug if slug is not provided
  
    // If metadata is missing optional fields, assign default values
    const completeMetadata = {
      author: metadata.author,
      publishDate: metadata.publishDate,
      lastUpdated: metadata.lastUpdated || undefined, // Use undefined instead of null
      tags: metadata.tags || [],
      readingTime: metadata.readingTime || undefined, // Use undefined instead of null
      difficulty: metadata.difficulty || "beginner",  // Default to "beginner"
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
  async getBlogBySlug(slug: string): Promise<Blog> {
    const blog = await this.database.getBlogBySlug(slug);

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    return blog;
  }

  // Get all blogs
  async getAllBlogs(): Promise<Blog[]> {
    return await this.database.getAllBlogs();
  }

  // Update a blog's content or metadata
  async updateBlog(slug: string, blogData: Partial<Blog>): Promise<Blog> {
    const existingBlog = await this.database.getBlogBySlug(slug);

    if (!existingBlog) {
      throw new NotFoundError("Blog not found");
    }

    // Update only the fields passed in the blogData
    const updatedBlog = await this.database.updateBlog(slug, blogData);

    return updatedBlog;
  }

  // Delete a blog by its slug
  async deleteBlog(slug: string): Promise<void> {
    const existingBlog = await this.database.getBlogBySlug(slug);

    if (!existingBlog) {
      throw new NotFoundError("Blog not found");
    }

    await this.database.deleteBlog(slug);
  }
}

export const blogService = new BlogServiceImpl();
