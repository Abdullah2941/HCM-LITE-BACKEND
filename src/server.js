import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectMongo } from './db/mongo.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import orgRoutes from './routes/orgRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: config.frontendOrigin.split(',').map(x => x.trim()), credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'hcm-lite-api', database: 'json-file', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/organization', orgRoutes);
app.use(notFound);
app.use(errorHandler);

connectMongo().then(() => {
  app.listen(config.port, () => console.log(`HCM Lite Express API listening at http://localhost:${config.port}`));
}).catch(err => {
  console.error('File data store failed:', err.message);
  console.error('Check write permissions for backend/data. API server was not started.');
  process.exit(1);
});
