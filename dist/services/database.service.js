"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const blog_model_1 = require("../models/blog.model"); // Import the model (not just the type)
const error_1 = require("../middleware/error"); // Adjust path if necessary
const cloudinary_service_1 = require("../services/cloudinary.service"); // Import Cloudinary upload service
class DatabaseService {
    // Save a blog to the database
    async saveBlog(blogData) {
        // Check for duplicate blog title or any other validation logic
        const existingBlog = await blog_model_1.BlogModel.findOne({ title: blogData.title });
        if (existingBlog) {
            throw new error_1.BadRequestError("Blog title already exists");
        }
        // Iterate through content array and handle images
        if (blogData.content && Array.isArray(blogData.content)) {
            for (let i = 0; i < blogData.content.length; i++) {
                const contentItem = blogData.content[i];
                if (contentItem.type === "image" && contentItem.content) {
                    const imageData = contentItem.content;
                    // If the image is in base64 format, upload it to Cloudinary
                    if (imageData.startsWith("data:image")) {
                        const uploadedImage = await (0, cloudinary_service_1.uploadImage)(imageData); // Call the Cloudinary service for base64 images
                        blogData.content[i].content = uploadedImage.secure_url; // Save the Cloudinary URL in place of base64 string
                        blogData.content[i].cloudinary_id =
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
        const newBlog = new blog_model_1.BlogModel({
            ...blogData,
            slug: this.generateSlug(blogData.title), // You can handle the slug generation in the model or here
        });
        // Save the blog to the database
        await newBlog.save();
        return newBlog;
    }
    // Get a blog by its slug
    async getBlogBySlug(slug) {
        const blog = await blog_model_1.BlogModel.findOne({ slug });
        return blog || null;
    }
    // Get all blogs with optional filters like tags and difficulty
    async getAllBlogs(filters = {}) {
        const { tags, difficulty } = filters;
        const filterConditions = {};
        if (tags) {
            filterConditions["metadata.tags"] = { $in: tags }; // Find blogs with at least one of the given tags
        }
        if (difficulty) {
            filterConditions["metadata.difficulty"] = difficulty;
        }
        const blogs = await blog_model_1.BlogModel.find(filterConditions);
        return blogs;
    }
    // Update a blog by its slug
    async updateBlog(slug, blogData) {
        // Find the blog document by slug to check for existing content (like images)
        const existingBlog = await blog_model_1.BlogModel.findOne({ slug });
        if (!existingBlog) {
            throw new error_1.NotFoundError("Blog not found");
        }
        // Delete the old blog content, including images from Cloudinary (if needed)
        if (existingBlog.content && Array.isArray(existingBlog.content)) {
            for (let i = 0; i < existingBlog.content.length; i++) {
                const contentItem = existingBlog.content[i];
                // If the contentItem is an image and has a Cloudinary ID
                if (contentItem.type === "image" && typeof contentItem.content === "string") {
                    const oldCloudinaryPublicId = (0, cloudinary_service_1.extractCloudinaryPublicId)(contentItem.content);
                    // Delete the image from Cloudinary if it exists
                    if (oldCloudinaryPublicId) {
                        try {
                            await (0, cloudinary_service_1.deleteImageFromCloudinary)(oldCloudinaryPublicId); // Delete old image from Cloudinary
                        }
                        catch (deleteError) {
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
                            const uploadedImage = await (0, cloudinary_service_1.uploadImage)(imageData); // Upload the base64 image to Cloudinary
                            blogData.content[i].content = uploadedImage.secure_url; // Save the Cloudinary URL
                            blogData.content[i].cloudinary_id = uploadedImage.public_id; // Save cloudinary_id
                        }
                        catch (uploadError) {
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
        const updatedBlog = await blog_model_1.BlogModel.findOneAndUpdate({ slug }, { $set: updatedBlogData }, // Completely replace the existing blog data with new data
        { new: true } // Ensure the updated document is returned
        );
        if (!updatedBlog) {
            throw new error_1.NotFoundError("Blog not found");
        }
        return updatedBlog;
    }
    // Delete a blog by its slug
    async deleteBlog(slug) {
        // Find the blog document by slug
        const blog = await blog_model_1.BlogModel.findOne({ slug });
        if (!blog) {
            throw new error_1.NotFoundError("Blog not found");
        }
        // If there are images in the content, delete them from Cloudinary
        if (blog.content && Array.isArray(blog.content)) {
            for (let i = 0; i < blog.content.length; i++) {
                const contentItem = blog.content[i];
                // Check if the content item is an image and has a URL
                if (contentItem.type === "image" && contentItem.content) {
                    //console.log(`Processing image at index ${i}: ${contentItem.content}`);
                    // Extract the publicId from the image URL
                    const cloudinaryPublicId = (0, cloudinary_service_1.extractCloudinaryPublicId)(contentItem.content);
                    // Log the publicId extracted from the contentItem
                    //console.log("Extracted cloudinaryPublicId:", cloudinaryPublicId);
                    // Ensure that cloudinaryPublicId is defined before calling the delete function
                    if (cloudinaryPublicId) {
                        await (0, cloudinary_service_1.deleteImageFromCloudinary)(contentItem.content); // Delete image using Cloudinary API
                    }
                }
            }
        }
        // Delete the blog document from the database
        await blog_model_1.BlogModel.findOneAndDelete({ slug });
    }
    // Utility method to generate a slug from a title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }
}
exports.DatabaseService = DatabaseService;
