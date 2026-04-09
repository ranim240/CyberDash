import db from '../../config/db.js'
const getProfile = async (req,res) =>{
    const learner =await db("learner").first();
    const user = await db("")
    res.json(learner);
};

const updateProfile = async (req,res) =>{
    const userID = req.
    knex('learner').where('user_id', '=', userId).update({
  status: 'archived',
  thisKeyIsSkipped: undefined,
});
};
export default getProfile;