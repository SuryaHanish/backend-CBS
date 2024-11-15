"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryBySlug = exports.getAllCategories = exports.createCategory = void 0;
const categoryService = __importStar(require("../services/category.service"));
// Type guard to narrow down 'unknown' to 'Error'
function isError(err) {
    return err instanceof Error;
}
// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, subjectSlug, slug } = req.body;
        const category = await categoryService.createCategory(name, subjectSlug, slug);
        res.status(201).json({ message: 'Category created successfully', category });
    }
    catch (err) {
        if (isError(err)) {
            res.status(500).json({ message: 'Error creating category', error: err.message });
        }
    }
};
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ categories });
    }
    catch (err) {
        if (isError(err)) {
            res.status(500).json({ message: 'Error fetching categories', error: err.message });
        }
    }
};
exports.getAllCategories = getAllCategories;
// Get a category by its slug
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    }
    catch (err) {
        if (isError(err)) {
            res.status(500).json({ message: 'Error fetching category', error: err.message });
        }
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
// Update a category by slug
const updateCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const { name, subjectSlug } = req.body;
        const updatedCategory = await categoryService.updateCategory(slug, name, subjectSlug);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    }
    catch (err) {
        if (isError(err)) {
            res.status(500).json({ message: 'Error updating category', error: err.message });
        }
    }
};
exports.updateCategory = updateCategory;
// Delete a category by slug
const deleteCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.deleteCategory(slug);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category and associated topics deleted successfully' });
    }
    catch (err) {
        if (isError(err)) {
            res.status(500).json({ message: 'Error deleting category', error: err.message });
        }
    }
};
exports.deleteCategory = deleteCategory;
