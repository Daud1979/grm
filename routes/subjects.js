import { Router } from 'express';
const router = Router();
router.get('/', (_, res) => res.send('Listado de asignaturas (pendiente)'));
export default router;
