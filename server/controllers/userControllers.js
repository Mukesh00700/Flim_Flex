export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};