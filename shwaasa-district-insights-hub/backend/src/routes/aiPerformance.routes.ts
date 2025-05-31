import { Router } from 'express';
import { getAIPerformance } from '../controllers/aiPerformance.controller';

const router = Router();

router.get('/', getAIPerformance);

export default router;