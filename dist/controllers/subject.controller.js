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
// Create a new subject
const createSubject = async (req, res) => {
    try {
        const subject = await subjectService.createSubject(req.body);
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
        const subjects = await subjectService.getSubjects();
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
        const subject = await subjectService.getSubjectBySlug(req.params.slug);
        if (subject) {
            return res.status(200).json(subject);
        }
        return res.status(404).json({ message: 'Subject not found' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching subject', error });
    }
};
exports.getSubjectBySlug = getSubjectBySlug;
// Update a subject by slug
const updateSubject = async (req, res) => {
    try {
        const updatedSubject = await subjectService.updateSubject(req.params.slug, req.body);
        if (updatedSubject) {
            return res.status(200).json(updatedSubject);
        }
        return res.status(404).json({ message: 'Subject not found' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error updating subject', error });
    }
};
exports.updateSubject = updateSubject;
// Delete a subject by slug
const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await subjectService.deleteSubject(req.params.slug);
        if (deletedSubject) {
            return res.status(200).json({ message: 'Subject deleted successfully' });
        }
        return res.status(404).json({ message: 'Subject not found' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error deleting subject', error });
    }
};
exports.deleteSubject = deleteSubject;
