import { getEngagedLearnersCount } from './instructor.service.js';

export const getDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    

    const total = await getEngagedLearnersCount(instructorId);

    res.json({ engaged_learners: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};