import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { dirname } from 'path';
import { v4 as uuid } from 'uuid';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function logger(msg, logFile) {
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'Logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'Logs'));
    }
    const date = format(new Date(), 'MM/dd/yyyy:HH:mm:ss');
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'Logs', logFile),
      msg
    );
  } catch (error) {
    console.log(error);
  }
}

export default logger;
