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
            .whereILike('name', name)
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
                status: 'approved'
            })
            .select('challenge_id', 'title', 'description', 'difficulty', 'points', 'created_at')
            .orderBy('created_at', 'desc');
    }
    // Count challenges per category
    getCategoriesWithStats = () => {
    return db('category as c')
        .leftJoin('challenge as ch', function () {
            this.on('c.category_id', '=', 'ch.category_id')
                .andOn('ch.status', '=', db.raw('?', ['approved']));
        })
        .groupBy('c.category_id')
        .select(
            'c.category_id',
            'c.name',
            'c.description',
            db.raw('COUNT(ch.challenge_id) as total_challenges')
        )
        .orderBy('c.name', 'asc');
};
}

export default new Category();
