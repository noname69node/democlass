import mongoose from 'mongoose';
import logger from './logger';

async function connect() {
  try {
    // await mongoose.connect(process.env.MONGODB_URI as string);
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info('Connected to DB');
  } catch (error) {
    logger.error(`Can not connect to db, error: ${error}`);
    process.exit(1);
  }
}

export default connect;
