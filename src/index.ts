import { compressAndEncryptFile } from './file';
import 'dotenv/config';
import { uploadFile } from './cloudflare';
import { checkEnvVars, getDateAsString } from './utils';

try {
  checkEnvVars();
  run();
} catch (error) {
  console.error(error);
}

/**
 * Runs the backup process for all files in BACKUP_PATHS.
 */
function run() {
  const backupPaths = process.env.BACKUP_PATHS!.split(';');
  for (const path of backupPaths) {
    if (path.length < 1) {
      continue;
    }
    backupFile(path);
  }
}

/**
 * Compresses and encrypts a file and uploads it to Cloudflare.
 * @param path path of the file to backup
 */
async function backupFile(path: string) {
  console.log(`---Starting backup of ${path}.---`);
  const passphrase = process.env.PASSPHRASE!;
  const data = await compressAndEncryptFile(path, passphrase);
  const fileName = path.split('/').pop()!;
  const currentDate = getDateAsString();
  const fileNameComplete = `${fileName}_${currentDate}.tar.gz.gpg`;
  await uploadFile(fileNameComplete, data);
  console.log(`---Completed backup of ${path}.---`);
}
