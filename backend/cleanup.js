import mongoose from 'mongoose';
import 'dotenv/config';

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management');
    console.log('Connected to MongoDB');
    
    // Clear users collection
    const result = await mongoose.connection.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);
    
    // Clear tasks collection
    const taskResult = await mongoose.connection.collection('tasks').deleteMany({});
    console.log(`Deleted ${taskResult.deletedCount} tasks`);
    
    await mongoose.disconnect();
    console.log('Database cleaned successfully');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup error:', err);
    process.exit(1);
  }
}

cleanup();
