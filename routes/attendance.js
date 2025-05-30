import { Router } from 'express';
const router = Router();
router.get('/', (_, res) => res.send('Panel de asistencias (pendiente)'));
export default router;
