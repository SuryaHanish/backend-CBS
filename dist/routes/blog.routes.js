"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes/blog.routes.ts
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const router = (0, express_1.Router)();
// Helper to wrap async functions
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Route to create a new blog
router.post("/blogs", asyncHandler((req, res) => blog_controller_1.blogController.createBlog(req, res)));
// Route to get a blog by its slug
router.get("/blogs/:slug", asyncHandler((req, res) => blog_controller_1.blogController.getBlogBySlug(req, res)));
// Route to get all blogs
router.get("/blogs", asyncHandler((req, res) => blog_controller_1.blogController.getAllBlogs(req, res)));
// Route to update a blog by its slug
router.put("/blogs/:slug", asyncHandler((req, res) => blog_controller_1.blogController.updateBlog(req, res)));
// Route to delete a blog by its slug
router.delete("/blogs/:slug", asyncHandler((req, res) => blog_controller_1.blogController.deleteBlog(req, res)));
exports.default = router;
