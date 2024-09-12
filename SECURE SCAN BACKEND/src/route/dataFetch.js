import { Router } from 'express';
import ScanResult from '../models/ScanResults.js';
const router = Router();

// Basic GET request to check server status
router.get('/', async(req, res) => {
    const data = await ScanResult.find({});
    res.status(200).json(data);
});

export default router;