import { Router } from 'express';
import { getAlerts, markAlertAsResolved } from '../controllers/alert.controller';


const router = Router();

router.get('/', getAlerts);
router.patch('/:id/resolve', markAlertAsResolved);

export default router;