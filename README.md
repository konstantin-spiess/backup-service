# backup-service

A service for securely backing up files and folders to Cloudflare R2 Storage.

## Configuration

In order to function correctly the following environment variables have to be set.
|Name|Value|
|-|-|
|ACCOUNT_ID|Cloudflare account id
R2_ACCESS_KEY_ID| Cloudflare R2 access_key_id
R2_SECRET_ACCESS_KEY| Cloudflare R2 secret_access_key
R2_BUCKET_NAME|Name of the R2 bucket
PASSPHRASE|Password to decrypt files
BACKUP_PATHS|Paths to files and folders you want to backup, seperated by ";"

## TODO

- Custom backup file names
- Delete files after certain time
- Make encryption optional
