import { archiveAndCompressFile, createFolder, encryptFile, removeFolder } from './file';
import 'dotenv/config';
import { uploadFile } from './cloudflare';
import { checkEnvVars, getDateAsString } from './utils';

const TEMP_FOLDER_PATH = './temp';
const COMPRESSED_ARCHIVE_FILE_NAME = 'backup.tar.gz';
const COMPRESSED_ARCHIVE_PATH = `${TEMP_FOLDER_PATH}/${COMPRESSED_ARCHIVE_FILE_NAME}`;
const ENCRYPTED_ARCHIVE_FILE_NAME = 'backup.tar.gz.gpg';
const ENCRYPTED_ARCHIVE_PATH = `${TEMP_FOLDER_PATH}/${ENCRYPTED_ARCHIVE_FILE_NAME}`;

try {
  run();
} catch (error) {
  console.error(error);
}

/**
 * Runs the backup process for all paths in BACKUP_PATHS.
 */
async function run() {
  checkEnvVars();
  await removeFolder(TEMP_FOLDER_PATH);
  await createFolder(TEMP_FOLDER_PATH);
  try {
    const backups = process.env.BACKUP_PATHS!.split(';');
    for (const backup of backups) {
      const [path, key] = backup.split(':');
      if (path.length > 0 && key.length > 0) {
        await backupFile(path, key);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    await removeFolder(TEMP_FOLDER_PATH);
  }
}

/**
 * Compresses and encrypts a file and uploads it to Cloudflare.
 * @param path path of the file to backup
 */
async function backupFile(path: string, key: string) {
  console.log(`---Starting backup of ${path}.---`);
  const passphrase = process.env.PASSPHRASE!;
  await archiveAndCompressFile(path, COMPRESSED_ARCHIVE_PATH);
  await encryptFile(COMPRESSED_ARCHIVE_PATH, passphrase, ENCRYPTED_ARCHIVE_PATH);
  const remoteKey = `${key}_${getDateAsString()}.tar.gz.gpg`;
  await uploadFile(ENCRYPTED_ARCHIVE_PATH, remoteKey);
  console.log(`---Completed backup of ${path}.---`);
}
