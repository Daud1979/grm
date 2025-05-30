import { Router } from 'express';
import * as ctl from '../controllers/teacherController.js';
const router = Router();
router.get('/', ctl.index);
router.get('/new', ctl.form);
router.post('/', ctl.create);
export default router;
