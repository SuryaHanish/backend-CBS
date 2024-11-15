"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.updateSubject = exports.getSubjectBySlug = exports.getSubjects = exports.createSubject = void 0;
const subject_model_1 = __importDefault(require("../models/subject.model"));
const createSubject = async (subjectData) => {
    const subject = new subject_model_1.default(subjectData);
    return await subject.save();
};
exports.createSubject = createSubject;
const getSubjects = async () => {
    return await subject_model_1.default.find();
};
exports.getSubjects = getSubjects;
const getSubjectBySlug = async (slug) => {
    return await subject_model_1.default.findOne({ slug });
};
exports.getSubjectBySlug = getSubjectBySlug;
const updateSubject = async (slug, updateData) => {
    return await subject_model_1.default.findOneAndUpdate({ slug }, updateData, { new: true });
};
exports.updateSubject = updateSubject;
const deleteSubject = async (slug) => {
    return await subject_model_1.default.findOneAndDelete({ slug });
};
exports.deleteSubject = deleteSubject;
