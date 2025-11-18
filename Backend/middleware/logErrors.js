import logger from './logger.js';

async function errLogger(err, req, res, next) {
  try {
    await logger(`${err.message}\t${err.stack}`, 'errorlog.txt');
    console.log('‼️ Error logged');
    next(err);
  } catch (error) {
    console.log(error);
  }
}

export default errLogger;
