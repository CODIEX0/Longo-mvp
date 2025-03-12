import express from 'express';
import adminRoutes from './routes';
import { requireAdminAuth } from './middleware/adminAuth.middleware';

const app = express();
const port = process.env.ADMIN_PORT || 3001;

app.use(express.json());
app.use(requireAdminAuth);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Admin server running on port ${port}`);
}); 