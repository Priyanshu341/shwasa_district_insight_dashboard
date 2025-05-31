import { Router } from 'express';
import { getSmartStopData } from '../controllers/smartStop.controller';

const router = Router();

router.get('/', getSmartStopData);

export default router;