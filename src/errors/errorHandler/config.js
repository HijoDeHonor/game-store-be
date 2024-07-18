import dotenv from 'dotenv';

dotenv.config();

const environment = {
  environment: process.env.NODE_ENV || 'development'
};

export default environment;
