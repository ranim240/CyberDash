import { v4 as uuid } from 'uuid';
import Category from './category.queries.js';
import { validateCreateCategory, validateUpdateCategory } from './category.validation.js';
import { success, error } from '../../utils/response.js';

// Get all categories
export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.getAllCategories();
        return success(res, categories);
    } catch (err) {
        next(err);
    }
};

// Get a single category by its ID
export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.getCategoryById(req.params.id);
        if (!category) return error(res, 'Category not found', 404);

        return success(res, category);
    } catch (err) {
        next(err);
    }
};

// Create a new category
export const createCategory = async (req, res, next) => {
    try {
        // 1. validate data 
        const errors = validateCreateCategory(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors
            })
        }

        // 2. verify if the name exists already 
        const existing = await Category.getCategoryByName(req.body.name);
        if (existing) {
            return error(res, 'A category with this name already exists', 409);
        }

        // 3. create a category 
        const [category] = await Category.insertCategory(
            {
                category_id: uuid(),
                name: req.body.name.trim(),
                description: req.body.description || null,
                icon_url: req.body.icon_url || null,
            });
        return success(res, category, 201);
    } catch (err) {
        next(err);
    }
};

// Update an existing category
export const updateCategory = async (req, res, next) => {
    try {
        // 1. Validate the data
        const errors = validateUpdateCategory(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // 2. Check that the category exists
        const existing = await Category.getCategoryById(req.params.id);
        if (!existing) return error(res, 'Category not found', 404);

        // 3. Update it
        const [category] = await Category.updateCategory(req.params.id, req.body);
        return success(res, category);
    } catch (err) {
        next(err);
    }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
    try {
        const existing = await Category.getCategoryById(req.params.id);
        if (!existing) return error(res, 'Category not found', 404);

        await Category.deleteCategory(req.params.id);
        return success(res, { message: 'Category deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// Retrieve challenges for a category
export const getChallengesByCategory = async (req, res, next) => {
    try {
        const category = await Category.getCategoryById(req.params.id);
        if (!category) return error(res, 'Category not found', 404);

        const challenges = await Category.getChallengesByCategoryId(req.params.id);

        return success(res, { category, challenges });
    } catch (err) {
        next(err);
    }
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getChallengesByCategory
};