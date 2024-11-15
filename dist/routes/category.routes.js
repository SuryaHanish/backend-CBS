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
// routes/category.routes.ts
const express_1 = require("express");
const categoryController = __importStar(require("../controllers/category.controller"));
const router = (0, express_1.Router)();
// Helper to wrap async functions
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Route to create a new category
router.post('/categories', asyncHandler((req, res) => categoryController.createCategory(req, res)));
// Route to get all categories
router.get('/categories', asyncHandler((req, res) => categoryController.getAllCategories(req, res)));
// Route to get a category by its slug
router.get('/category/:slug', asyncHandler((req, res) => categoryController.getCategoryBySlug(req, res)));
// Route to update a category by its slug
router.put('/category/:slug', asyncHandler((req, res) => categoryController.updateCategory(req, res)));
// Route to delete a category by its slug
router.delete('/category/:slug', asyncHandler((req, res) => categoryController.deleteCategory(req, res)));
exports.default = router;
