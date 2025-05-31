
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import aiPerformanceRoutes from './routes/aiPerformance.routes';
import facilityRoutes from './routes/facility.routes';
import scanRoutes from './routes/scan.routes';
import alertsRoutes from './routes/alerts.routes';
import smartStopRoutes from './routes/smartStop.routes';
import districtRoutes from './routes/district.routes';
import userRoutes from './routes/user.routes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('District Insights Hub API is running');
});

// Main API routes
app.use('/api/ai-performance', aiPerformanceRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/smart-stop', smartStopRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/users', userRoutes);

// Global error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;