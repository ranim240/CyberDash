import user from "./user.queries.js";


export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const profile = await user.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};