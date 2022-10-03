import crypto from 'crypto'

const main = async () => {
    const secret = crypto.randomBytes(32)
    const hashLock = crypto.createHash('sha256').update(secret).digest()
    console.log('Secret: ', bufferToString(secret))
    console.log('HashLock: ', bufferToString(hashLock))
};

const bufferToString = (b: Buffer) => '0x' + b.toString('hex')

main();

