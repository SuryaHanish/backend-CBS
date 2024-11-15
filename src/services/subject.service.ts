import Subject, { ISubject } from '../models/subject.model';

export const createSubject = async (subjectData: ISubject): Promise<ISubject> => {
  const subject = new Subject(subjectData);
  return await subject.save();
};

export const getSubjects = async (): Promise<ISubject[]> => {
  return await Subject.find();
};

export const getSubjectBySlug = async (slug: string): Promise<ISubject | null> => {
  return await Subject.findOne({ slug });
};

export const updateSubject = async (slug: string, updateData: Partial<ISubject>): Promise<ISubject | null> => {
  return await Subject.findOneAndUpdate({ slug }, updateData, { new: true });
};

export const deleteSubject = async (slug: string): Promise<ISubject | null> => {
  return await Subject.findOneAndDelete({ slug });
};
