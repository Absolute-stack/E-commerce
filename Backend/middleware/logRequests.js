import logger from './logger.js';

async function reqLogger(req, res, next) {
  try {
    await logger(
      `${req.method}\t${req.headers.origin || 'Unknown Origin'}\t${req.url}`,
      'reqlog.txt'
    );
    console.log('✅ Request successfully logged');
  } catch (error) {
    console.log(error);
  }
  next();
}

export default reqLogger;
