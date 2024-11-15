import { BlogModel, ImageContent } from "../models/blog.model"; // Import the model (not just the type)
import { BadRequestError, NotFoundError } from "../middleware/error"; // Adjust path if necessary
import { Blog } from "../models/blog.model"; // Import the Blog type for typing the input and output
import {
  deleteImageFromCloudinary,
  extractCloudinaryPublicId,
  uploadImage,
} from "../services/cloudinary.service"; // Import Cloudinary upload service

export class DatabaseService {
  // Save a blog to the database
  public async saveBlog(blogData: Blog): Promise<Blog> {
    // Check for duplicate blog title or any other validation logic
    const existingBlog = await BlogModel.findOne({ title: blogData.title });
    if (existingBlog) {
      throw new BadRequestError("Blog title already exists");
    }

    // Iterate through content array and handle images
    if (blogData.content && Array.isArray(blogData.content)) {
      for (let i = 0; i < blogData.content.length; i++) {
        const contentItem = blogData.content[i];

        if (contentItem.type === "image" && contentItem.content) {
          const imageData = contentItem.content;

          // If the image is in base64 format, upload it to Cloudinary
          if (imageData.startsWith("data:image")) {
            const uploadedImage = await uploadImage(imageData); // Call the Cloudinary service for base64 images
            blogData.content[i].content = uploadedImage.secure_url; // Save the Cloudinary URL in place of base64 string
            (blogData.content[i] as ImageContent).cloudinary_id =
              uploadedImage.public_id; // Safely add cloudinary_id to ImageContent
          }
          // For normal image URLs, we can directly save them as is
          else {
            blogData.content[i].content = imageData; // Save normal image URL directly
          }
        }
      }
    }

    // Create a new blog document
    const newBlog = new BlogModel({
      ...blogData,
      slug: this.generateSlug(blogData.title), // You can handle the slug generation in the model or here
    });

    // Save the blog to the database
    await newBlog.save();

    return newBlog;
  }

  // Get a blog by its slug
  public async getBlogBySlug(slug: string): Promise<Blog | null> {
    const blog = await BlogModel.findOne({ slug });
    return blog || null;
  }

  // Get all blogs with optional filters like tags and difficulty
  public async getAllBlogs(
    filters: {
      tags?: string[];
      difficulty?: "beginner" | "intermediate" | "advanced";
    } = {}
  ): Promise<Blog[]> {
    const { tags, difficulty } = filters;
    const filterConditions: any = {};

    if (tags) {
      filterConditions["metadata.tags"] = { $in: tags }; // Find blogs with at least one of the given tags
    }

    if (difficulty) {
      filterConditions["metadata.difficulty"] = difficulty;
    }

    const blogs = await BlogModel.find(filterConditions);
    return blogs;
  }

  // Update a blog by its slug
  public async updateBlog(
    slug: string,
    blogData: Partial<Blog>
  ): Promise<Blog> {
    // Find the blog document by slug to check for existing content (like images)
    const existingBlog = await BlogModel.findOne({ slug });
  
    if (!existingBlog) {
      throw new NotFoundError("Blog not found");
    }
  
    // Delete the old blog content, including images from Cloudinary (if needed)
    if (existingBlog.content && Array.isArray(existingBlog.content)) {
      for (let i = 0; i < existingBlog.content.length; i++) {
        const contentItem = existingBlog.content[i];
  
        // If the contentItem is an image and has a Cloudinary ID
        if (contentItem.type === "image" && typeof contentItem.content === "string") {
          const oldCloudinaryPublicId = extractCloudinaryPublicId(contentItem.content);
  
          // Delete the image from Cloudinary if it exists
          if (oldCloudinaryPublicId) {
            try {
              await deleteImageFromCloudinary(oldCloudinaryPublicId); // Delete old image from Cloudinary
            } catch (deleteError) {
              console.error("Error deleting old image from Cloudinary:", deleteError);
            }
          }
        }
      }
    }
  
    // Handle new images in blogData.content if they exist
    if (blogData.content && Array.isArray(blogData.content)) {
      for (let i = 0; i < blogData.content.length; i++) {
        const contentItem = blogData.content[i];
  
        if (contentItem.type === "image" && contentItem.content) {
          const imageData = contentItem.content;
  
          // If the image is in base64 format, upload it to Cloudinary
          if (imageData.startsWith("data:image")) {
            try {
              const uploadedImage = await uploadImage(imageData); // Upload the base64 image to Cloudinary
              blogData.content[i].content = uploadedImage.secure_url; // Save the Cloudinary URL
              (blogData.content[i] as ImageContent).cloudinary_id = uploadedImage.public_id; // Save cloudinary_id
            } catch (uploadError) {
              console.error("Error uploading image:", uploadError);
            }
          }
          // For normal image URLs, we can directly save them as is
          else if (typeof imageData === "string" && imageData.startsWith("http")) {
            // If it's a URL, it's already hosted, so just save it as is
            blogData.content[i].content = imageData; // Save the URL directly
          }
        }
      }
    }
  
    // Now that old content is deleted and new images are uploaded, let's prepare the updated blog data
    const updatedBlogData = {
      ...blogData,
      content: blogData.content || [], // Ensure we use the new content provided (or empty array if none)
    };
  
    // Perform the update operation with the new data
    const updatedBlog = await BlogModel.findOneAndUpdate(
      { slug },
      { $set: updatedBlogData }, // Completely replace the existing blog data with new data
      { new: true } // Ensure the updated document is returned
    );
  
    if (!updatedBlog) {
      throw new NotFoundError("Blog not found");
    }
  
    return updatedBlog;
  }
  
  
  
  


  // Delete a blog by its slug
  public async deleteBlog(slug: string): Promise<void> {
    // Find the blog document by slug
    const blog = await BlogModel.findOne({ slug });

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    // If there are images in the content, delete them from Cloudinary
    if (blog.content && Array.isArray(blog.content)) {
      for (let i = 0; i < blog.content.length; i++) {
        const contentItem = blog.content[i];

        // Check if the content item is an image and has a URL
        if (contentItem.type === "image" && contentItem.content) {
          //console.log(`Processing image at index ${i}: ${contentItem.content}`);

          // Extract the publicId from the image URL
          const cloudinaryPublicId = extractCloudinaryPublicId(
            contentItem.content
          );

          // Log the publicId extracted from the contentItem
          //console.log("Extracted cloudinaryPublicId:", cloudinaryPublicId);

          // Ensure that cloudinaryPublicId is defined before calling the delete function
          if (cloudinaryPublicId) {
            await deleteImageFromCloudinary(contentItem.content); // Delete image using Cloudinary API
          }
        }
      }
    }

    // Delete the blog document from the database
    await BlogModel.findOneAndDelete({ slug });
  }

  // Utility method to generate a slug from a title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
}
