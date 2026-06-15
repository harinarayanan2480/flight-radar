import { Router } from 'express';
import { getCachedFlights } from '../services/cache.service';

const router = Router();

router.get('/', (req, res) => {
    res.json(getCachedFlights());
});

export default router;