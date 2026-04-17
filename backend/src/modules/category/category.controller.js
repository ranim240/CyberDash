import { v4 as uuid } from 'uuid';
import categoryRepository from './category.queries.js';
import { validateCreateCategory, validateUpdateCategory } from './category.validation.js';
import { success, error } from '../../utils/response.js';

class CategoryController {
    // Get all categories
    getAllCategories = async (req, res, next) => {
        try {
            const categories = await categoryRepository.getAllCategories();
            return success(res, categories);
        } catch (err) {
            next(err);
        }
    };

    // Get a single category by its ID
    getCategoryById = async (req, res, next) => {
        try {
            const category = await categoryRepository.getCategoryById(req.params.id);
            if (!category) return error(res, 'Category not found', 404);

            return success(res, category);
        } catch (err) {
            next(err);
        }
    };

    // Create a new category
    createCategory = async (req, res, next) => {
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
            const existing = await categoryRepository.getCategoryByName(req.body.name);
            if (existing) {
                return error(res, 'A category with this name already exists', 409);
            }

            // 3. create a category 
            const [category] = await categoryRepository.insertCategory(
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
    updateCategory = async (req, res, next) => {
        try {
            // 1. Validate the data
            const errors = validateUpdateCategory(req.body);
            if (errors.length > 0) {
                return res.status(400).json({ success: false, errors });
            }

            // 2. Check that the category exists
            const existing = await categoryRepository.getCategoryById(req.params.id);
            if (!existing) return error(res, 'Category not found', 404);

            // 3. Update it
            const [category] = await categoryRepository.updateCategory(req.params.id, req.body);
            return success(res, category);
        } catch (err) {
            next(err);
        }
    };

    // Delete a category
    deleteCategory = async (req, res, next) => {
        try {
            const existing = await categoryRepository.getCategoryById(req.params.id);
            if (!existing) return error(res, 'Category not found', 404);

            await categoryRepository.deleteCategory(req.params.id);
            return success(res, { message: 'Category deleted successfully' });
        } catch (err) {
            next(err);
        }
    };

    // Retrieve challenges for a category
    getChallengesByCategory = async (req, res, next) => {
        try {
            const category = await categoryRepository.getCategoryById(req.params.id);
            if (!category) return error(res, 'Category not found', 404);

            const challenges = await categoryRepository.getChallengesByCategoryId(req.params.id);

            return success(res, { category, challenges });
        } catch (err) {
            next(err);
        }
    };
}

export default new CategoryController();