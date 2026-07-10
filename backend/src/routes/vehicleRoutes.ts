import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicleController';
import { authenticate, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Read operations are accessible to any authenticated user
router.get('/search', authenticate, searchVehicles); // Must be before /:id
router.get('/', authenticate, getVehicles);
router.get('/:id', authenticate, getVehicleById);

// Write operations are restricted to ADMIN only
router.post('/', authenticate, authorizeRole(['ADMIN']), createVehicle);
router.put('/:id', authenticate, authorizeRole(['ADMIN']), updateVehicle);
router.delete('/:id', authenticate, authorizeRole(['ADMIN']), deleteVehicle);

// Inventory operations
router.post('/:id/purchase', authenticate, purchaseVehicle);
router.post('/:id/restock', authenticate, authorizeRole(['ADMIN']), restockVehicle);

export default router;
