
import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server only after a successful database connection
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database connection error');
    process.exit(1);
  }
};

startServer();