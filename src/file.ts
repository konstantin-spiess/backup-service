import { spawn } from 'child_process';
import { Transform } from 'stream';

/**
 * Compresses and encrypts a file.
 * @param path path of the file
 * @param passphrase passphrase to en-/decrypt
 * @returns a promise that resolves to the compressed and encrypted file as a transform stream
 */
export function compressAndEncryptFile(path: string, passphrase: string) {
  const tar = spawn('tar', ['-cvzf', '-', path]);
  const gpg = spawn('gpg', ['-c', '--passphrase', passphrase, '--batch']);
  const data = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk);
      callback();
    },
  });

  tar.on('spawn', () => {
    console.log('Starting file compression.');
  });

  // pipe tar to gpg
  tar.stdout.on('data', (data) => {
    gpg.stdin.write(data);
  });

  // close gpg stdin when tar is done
  tar.on('close', () => {
    gpg.stdin.end();
    console.log('Completed file compression.');
  });

  gpg.on('spawn', () => {
    console.log('Starting file encryption.');
  });

  // pipe gpg to data
  gpg.stdout.pipe(data);

  const promise = new Promise<Transform>((resolve, reject) => {
    // reject if gpg or tar fails
    tar.on('error', (err) => {
      reject(err);
    });
    gpg.on('error', (err) => {
      reject(err);
    });

    // resolve when gpg is done
    gpg.on('close', (code) => {
      if (code === 0) {
        console.log('Completed file encryption.');
        resolve(data);
      } else {
        const err = new Error(`Child process exited with code ${code}`);
        reject(err);
      }
    });
  });

  return promise;
}
