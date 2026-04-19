// Validation for creating a category
export const validateCreateCategory = (data) => {

    const errors = [];

    if(!data.name || data.name.trim().length < 2){
        errors.push('Name is required and must be at least 2 characters');
    }

    return errors;
}

// Validation for updating a category
export const validateUpdateCategory = (data) => {

    const errors = [];

    if(!data.name && !data.description && !data.icon_url){
        errors.push('At least one field (name, description, icon_url) is required');
    }

    if(data.name && data.name.trim().length < 2){
        errors.push('Name must be at least 2 characters');
    }

    return errors;
}