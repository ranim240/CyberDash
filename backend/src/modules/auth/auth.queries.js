import db from '../../config/db.js'
import crypto from 'node:crypto';

export const findUserByEmail = (email) => {
    return db('user').where({ email }).first();
};

export const createUser = async (userData) => {

    const user_id = crypto.randomUUID();
    const role = userData.role || 'learner'; // Apply default role once

    return await db.transaction(async (trx) => {
        // Create basic user
        await trx('user').insert({
            user_id,
            username: userData.username,
            email: userData.email,
            password_hash: userData.password_hash,
            role
        });

        // If role is learner, create learner progression profile
        if (role === 'learner') {
            await trx('learner').insert({ user_id });
        }

        return { user_id, username: userData.username, email: userData.email, role };
    });
};

