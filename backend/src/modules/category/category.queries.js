import db from '../../config/db.js'

class Category {
    // Get all categories
    getAllCategories = () => {
        return db('category')
            .orderBy('name', 'asc');
    }

    // Retrieve a category by its ID
    getCategoryById = (categoryId) => {
        return db('category')
            .where({ category_id: categoryId })
            .first();
    }

    // Check if a category with this name already exists
    getCategoryByName = (name) => {
        return db('category')
            .whereRaw('LOWER(name) = ?', [name.toLowerCase()])
            .first();
    }

    // Create a new category
    insertCategory = (data) => {
        return db('category')
            .insert(data)
            .returning('*');
    }

    // Update a category
    updateCategory = (categoryId, data) => {
        return db('category')
            .where({ category_id: categoryId })
            .update(data)
            .returning('*');
    }

    // Delete a category
    deleteCategory = (categoryId) => {
        return db('category')
            .where({ category_id: categoryId })
            .del();
    }

    // Retrieve challenges of a category
    getChallengesByCategoryId = (categoryId) => {
        return db('challenge')
            .where({
                category_id: categoryId,
                status: 'active'
            })
            .select('challenge_id', 'title', 'description', 'difficulty', 'points', 'created_at')
            .orderBy('created_at', 'desc');
    }
}

export default new Category();
