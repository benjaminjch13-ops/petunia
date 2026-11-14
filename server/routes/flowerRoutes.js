import { Router } from 'express';
import * as controller from '../controllers/flowerController.js';
import { parseFlowerQuery } from '../middleware/parseFlowerQuery.js';
import { asyncHandler } from '../middleware/httpError.js';

const router = Router();

router.use(parseFlowerQuery);

// Las rutas específicas van antes de "/:id".
router.get('/', asyncHandler(controller.getFlowers));
router.get('/search', asyncHandler(controller.searchFlowers));
router.get('/featured', asyncHandler(controller.getFeatured));
router.get('/random', asyncHandler(controller.getRandom));
router.get('/daily', asyncHandler(controller.getDaily));
router.get('/compare', asyncHandler(controller.compare));
router.get('/category/:category', asyncHandler(controller.getByCategory));
router.get('/climate/:climate', asyncHandler(controller.getByClimate));
router.get('/season/:season', asyncHandler(controller.getBySeason));
router.get('/month/:month', asyncHandler(controller.getByMonth));
router.get('/:id', asyncHandler(controller.getFlowerById));
router.get('/:id/related', asyncHandler(controller.getRelated));

export default router;
