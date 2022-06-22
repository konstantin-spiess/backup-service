export function checkEnvVars() {
  console.log('Checking environment variables.');

  if (!process.env.ACCOUNT_ID) {
    throw new Error('ACCOUNT_ID is not set');
  }
  if (!process.env.R2_ACCESS_KEY_ID) {
    throw new Error('R2_ACCESS_KEY_ID is not set');
  }
  if (!process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2_SECRET_ACCESS_KEY is not set');
  }
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME is not set');
  }
  if (!process.env.PASSPHRASE) {
    throw new Error('PASSPHRASE is not set');
  }
  if (!process.env.BACKUP_PATHS) {
    throw new Error('BACKUP_PATHS is not set');
  }

  console.log('All environment variables are set.');
}

/**
 * Returns the current date as a string in the format YYYYMMDD_HHMMSS.
 */
export function getDateAsString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}
