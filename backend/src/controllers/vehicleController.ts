import { Request, Response } from 'express';
import { query } from '../config/db';

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
