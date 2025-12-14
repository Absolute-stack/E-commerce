import logger from './logger.js';

async function errLogger(err, req, res, next) {
  try {
    await logger(`${err.message}\t${err.stack}`, 'errorlog.txt');
    console.log(`${err.message}\t${err.stack}\t|${Date.now()}`);
    next(err);
  } catch (error) {
    console.log(error);
  }
}

export default errLogger;
