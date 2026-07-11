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

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { make, model, category, price, quantity, image_url } = req.body;
    const result = await query(
      'INSERT INTO vehicles (make, model, category, price, quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [make, model, category, price, quantity, image_url],
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { make, model, category, price, quantity, image_url } = req.body;

    // For simplicity, updating all fields, but in reality you'd build a dynamic query or coalesce
    const result = await query(
      'UPDATE vehicles SET make = COALESCE($1, make), model = COALESCE($2, model), category = COALESCE($3, category), price = COALESCE($4, price), quantity = COALESCE($5, quantity), image_url = COALESCE($6, image_url), updated_at = NOW() WHERE id = $7 RETURNING *',
      [make, model, category, price, quantity, image_url, id],
    );

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

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const searchVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let sql = 'SELECT * FROM vehicles WHERE 1=1';
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (make ILIKE $${params.length} OR model ILIKE $${params.length} OR category ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      sql += ` AND category ILIKE $${params.length}`;
    }
    if (minPrice) {
      params.push(minPrice);
      sql += ` AND price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      sql += ` AND price <= $${params.length}`;
    }

    const result = await query(sql, params);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const purchaseVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // First check stock
    const vehicle = await query('SELECT quantity FROM vehicles WHERE id = $1', [id]);

    if (vehicle.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    if (vehicle.rows[0].quantity <= 0) {
      res.status(400).json({ success: false, message: 'Vehicle is out of stock' });
      return;
    }

    // Decrement stock
    const result = await query(
      'UPDATE vehicles SET quantity = quantity - 1 WHERE id = $1 RETURNING *',
      [id],
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const restockVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
      return;
    }

    // Check if vehicle exists
    const vehicle = await query('SELECT id FROM vehicles WHERE id = $1', [id]);
    if (vehicle.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    // Increment stock
    const result = await query(
      'UPDATE vehicles SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
      [amount, id],
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
