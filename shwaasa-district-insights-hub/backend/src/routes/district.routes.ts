
import { Router } from 'express';
import { getDistricts, getDistrictById, getDistrictsByDisease } from '../controllers/district.controller';
import asyncHandler from '../middleware/asyncHandler';

const router = Router();

// Get all districts
router.get('/', asyncHandler(getDistricts));

// Get districts filtered by disease (for frontend disease filtering)
router.get('/disease/:disease', asyncHandler(getDistrictsByDisease));

// Get specific district by ID
router.get('/:id', asyncHandler(getDistrictById));

export default router;