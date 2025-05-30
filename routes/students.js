import { Router } from 'express';
const router = Router();
router.get('/', (_, res) => res.send('Listado de alumnos (pendiente)'));
export default router;
