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
exports.deleteSubject = exports.updateSubject = exports.getSubjectBySlug = exports.getSubjects = exports.createSubject = void 0;
const subjectService = __importStar(require("../services/subject.service"));
const cache_service_1 = require("../services/cache.service");
const SUBJECT_CACHE_TTL = 3600; // 1 hour cache TTL
// Create a new subject
const createSubject = async (req, res) => {
    try {
        const subject = await subjectService.createSubject(req.body);
        // Clear the subjects list cache since we added a new subject
        await (0, cache_service_1.clearCache)("all_subjects");
        return res.status(201).json(subject);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error creating subject', error });
    }
};
exports.createSubject = createSubject;
// Get all subjects
const getSubjects = async (_req, res) => {
    try {
        // Try to get from cache first
        const cachedSubjects = await (0, cache_service_1.getCacheData)("all_subjects");
        if (cachedSubjects) {
            return res.status(200).json(cachedSubjects);
        }
        // If not in cache, get from database
        const subjects = await subjectService.getSubjects();
        // Cache the results
        await (0, cache_service_1.cacheData)("all_subjects", subjects, SUBJECT_CACHE_TTL);
        return res.status(200).json(subjects);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching subjects', error });
    }
};
exports.getSubjects = getSubjects;
// Get a subject by slug
const getSubjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        // Try to get from cache first
        const cachedSubject = await (0, cache_service_1.getCacheData)(`subject_${slug}`);
        if (cachedSubject) {
            return res.status(200).json(cachedSubject);
        }
        // If not in cache, get from database
        const subject = await subjectService.getSubjectBySlug(slug);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        // Cache the results
        await (0, cache_service_1.cacheData)(`subject_${slug}`, subject, SUBJECT_CACHE_TTL);
        return res.status(200).json(subject);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching subject', error });
    }
};
exports.getSubjectBySlug = getSubjectBySlug;
// Update a subject by slug
const updateSubject = async (req, res) => {
    try {
        const { slug } = req.params;
        const updatedSubject = await subjectService.updateSubject(slug, req.body);
        if (!updatedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        // Clear relevant cache entries
        await (0, cache_service_1.clearCache)(`subject_${slug}`);
        await (0, cache_service_1.clearCache)("all_subjects");
        /* If the slug was updated, clear the old slug's cache as well
        if (updatedSubject.oldSlug && updatedSubject.oldSlug !== slug) {
          await clearCache(`subject_${updatedSubject.oldSlug}`);
          // Clear related category caches
          await clearCache(`subject_categories_${updatedSubject.oldSlug}`);
        }*/
        // Clear the new slug's category cache if it exists
        await (0, cache_service_1.clearCache)(`subject_categories_${slug}`);
        return res.status(200).json(updatedSubject);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error updating subject', error });
    }
};
exports.updateSubject = updateSubject;
// Delete a subject by slug
const deleteSubject = async (req, res) => {
    try {
        const { slug } = req.params;
        const deletedSubject = await subjectService.deleteSubject(slug);
        if (!deletedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        // Clear relevant cache entries
        await (0, cache_service_1.clearCache)(`subject_${slug}`);
        await (0, cache_service_1.clearCache)("all_subjects");
        // Clear related category cache
        await (0, cache_service_1.clearCache)(`subject_categories_${slug}`);
        // Clear the all categories cache since deleting a subject affects the category structure
        await (0, cache_service_1.clearCache)("all_categories");
        return res.status(200).json({ message: 'Subject deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error deleting subject', error });
    }
};
exports.deleteSubject = deleteSubject;
