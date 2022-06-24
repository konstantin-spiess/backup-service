import { spawn } from 'child_process';

type spawnChildProcessOptions = {
  log?: {
    spawn: string;
    close: string;
  };
};

/**
 *
 * @param cmd command to run
 * @param args arguments to pass to the command
 * @param options log options
 * @returns
 */
function spawnChildProcess(cmd: string, args: string[], options?: spawnChildProcessOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args);

    child.on('spawn', () => {
      console.log(options?.log?.spawn || 'Spawning child process.');
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(options?.log?.close || 'Child process closed.');
        resolve();
      } else {
        const err = new Error(`Child process exited with code ${code}`);
        reject(err);
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Creates a folder.
 * @param path path of the folder to create
 * @returns
 */
export function createFolder(path: string) {
  return spawnChildProcess('mkdir', ['-p', path], {
    log: { spawn: 'Starting folder creation.', close: 'Completed folder creation.' },
  });
}

/**
 * Deletes a folder.
 * @param path path of the folder to delete
 * @returns
 */
export function removeFolder(path: string) {
  return spawnChildProcess('rm', ['-rf', path], {
    log: { spawn: 'Starting folder removal.', close: 'Completed folder removal.' },
  });
}

/**
 * Archive and compress a file/folder.
 * @param srcPath path of the source file/folder
 * @param destPath path of the destination file/folder
 * @returns promise that resolves once the file/folder has been archived and compressed
 */
export function archiveAndCompressFile(srcPath: string, destPath: string) {
  return spawnChildProcess('tar', ['cfvz', destPath, srcPath], {
    log: { spawn: 'Starting file compression.', close: 'Completed file compression.' },
  });
}
/**
 * Encrypts a file.
 * @param srcPath path of the source file
 * @param passphrase passphrase to en-/decrypt the file
 * @param destPath path of the destination file
 * @returns promise that resolves once the file has been encrypted
 */
export function encryptFile(srcPath: string, passphrase: string, destPath: string) {
  return spawnChildProcess('gpg', ['-c', '--passphrase', passphrase, '--batch', '--output', destPath, srcPath], {
    log: { spawn: 'Starting file encryption.', close: 'Completed file encryption.' },
  });
}
