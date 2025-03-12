import { Router } from 'express';
import PointsService from '../services/PointsService';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { timeframe } = req.query;
    const leaderboard = await PointsService.getLeaderboard(timeframe);
    res.json(leaderboard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user rank
router.get('/rank', verifyToken, async (req, res) => {
  try {
    const rank = await PointsService.getUserRank(req.user.id);
    res.json({ rank });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Award points for completed task
router.post('/award', verifyToken, async (req, res) => {
  try {
    const { action, rating } = req.body;
    const pointsAwarded = await PointsService.awardPoints(req.user.id, action, rating);
    res.json({ points: pointsAwarded });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 