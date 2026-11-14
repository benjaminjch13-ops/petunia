import { Router } from 'express';
import flowerRoutes from './flowerRoutes.js';
import * as meta from '../controllers/metaController.js';
import { asyncHandler } from '../middleware/httpError.js';

const router = Router();

router.get('/health', meta.health);
router.get('/meta', asyncHandler(meta.getMeta));
router.get('/tips', meta.getTips);
router.get('/tips/random', meta.getRandomTip);
router.use('/flowers', flowerRoutes);

export default router;
