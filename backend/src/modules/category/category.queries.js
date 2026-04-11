import db from '../../config/db.js'

// Get all categories
export const getAllCategories = () => {
    return db('category')
    .orderBy('name','asc');
}

// Retrieve a category by its ID
export const getCategoryById = (categoryId) => {
    return db('category')
    .where( { category_id : categoryId } )
    .first();
}

// Check if a category with this name already exists
export const getCategoryByName = (name) => {
    return db('category')
    .whereRaw( 'LOWER(name) = ?' , [ name.toLowerCase() ])
    .first();
}

// Create a new category
export const insertCategory = (data) => {
    return db('category')
    .insert(data)
    .returning('*');
}

// Update a category
export const updateCategory = (categoryId, data) => {
    return db('category')
    .where( { category_id : categoryId })
    .update(data)
    .returning('*');
}

// Delete a category
export const deleteCategory = (categoryId) => {
    return db('category')
    .where( { category_id : categoryId })
    .del();
}

// Retrieve challenges of a category
export const getChallengesByCategoryId = (categoryId) => {
    return db('challenge')
    .where( { 
        category_id : categoryId,
        status : 'active'
    })
    .select( 'challenge_id', 'title', 'description', 'difficulty' , 'points', 'created_at')
    .orderBy('created_at', 'desc');
}
