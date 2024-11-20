// services/category.service.ts
import Category from '../models/category.model';
import Topic,{ITopic} from '../models/topic.model';
import { ICategory } from '../models/category.model';
import { TopicService } from './topic.service';
import { blogService } from './blog.service';

// Create a new category
export const createCategory = async (name: string, subjectSlug: string, slug: string): Promise<ICategory> => {
  const category = new Category({ name, subjectSlug, slug });
  return category.save();
};

// Get all categories
export const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find();
};

// Get a category by its slug
export const getCategoryBySlug = async (slug: string): Promise<ICategory | null> => {
  return Category.findOne({ slug });
};

// Update a category by slug
export const updateCategory = async (slug: string, name: string, subjectSlug: string): Promise<ICategory | null> => {
  return Category.findOneAndUpdate(
    { slug },
    { name, subjectSlug },
    { new: true } // Return the updated document
  );
};

// Get all categories by subjectSlug
export const getCategoriesBySubjectSlug = async (subjectSlug: string): Promise<ICategory[]> => {
  return Category.find({ subjectSlug });
};

// Delete a category by slug and its associated topics and blogs
export const deleteCategory = async (slug: string): Promise<ICategory | null> => {
  // Find the category to delete
  const category = await Category.findOneAndDelete({ slug });

  if (category) {
    // Find all topics related to this category
    const topics = await Topic.find({ categorySlug: slug });

    for (const topic of topics) {
      // Delete each topic using the TopicService
      if (topic.blogSlug) {
        await blogService.deleteBlog(topic.blogSlug); // Deleting associated blog
      }
      
      await TopicService.deleteTopic(topic.slug as string); // Delete the topic
    }
  }

  return category;
};
