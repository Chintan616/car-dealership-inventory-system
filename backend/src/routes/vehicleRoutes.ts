import { Router } from 'express';
import { getVehicles, getVehicleById } from '../controllers/vehicleController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Read operations are accessible to any authenticated user
router.get('/', authenticate, getVehicles);
router.get('/:id', authenticate, getVehicleById);

export default router;
