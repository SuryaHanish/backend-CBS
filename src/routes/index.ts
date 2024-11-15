import { Router } from 'express';
import blogRoutes from './blog.routes';

const router = Router();

router.use('/blogs', blogRoutes);

export default router;
