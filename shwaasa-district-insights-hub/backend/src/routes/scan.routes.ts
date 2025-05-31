import { Router } from 'express';
import { getScanData, updateScanData } from '../controllers/scan.controller';

const router = Router();

// GET /api/scans - Fetch scan data with history
router.get('/', getScanData);

// PUT /api/scans - Update scan data with history
router.put('/', updateScanData);

// POST /api/scans - Create new scan data (alias for PUT)
router.post('/', updateScanData);

export default router;