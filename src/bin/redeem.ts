import readline from 'readline';
import crypto from 'crypto'
import {RedeemDeposit, redeemDepositHandler} from '../../Context/Eth';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function question(question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, answer => {
        resolve(answer)
    }))
}

/**
 *
 * This script will be listen redeem events in Revpop blockchain and execute
 * Context/Revpop/Application/Command/RedeemDeposit/RedeemDepositHandler.ts
 *
 * It is used for tests now
 */
const main = async () => {
    console.log('This script will be watch Revpop redeem completed event and execute EES handlers.')
    const contractId = await question('Enter htlc contract id to test: ');
    const secret = await question('Enter hashLock: ');
    await question('Press enter');
    rl.close()

    // const contractId = '0xfbaed90f1b20d8f884fbd41eab14d370ce25ef874ee4061bb64856cbbfe71f70'
    // const secret = '0xe7435f68554b20f8c85606a014c258f6e66ed787284e6601a95a769558c62ff1'

    // const secret = crypto.randomBytes(32)
    // const hashLock = crypto.createHash('sha256').update(secret).digest()
    // console.log('Secret: ', bufferToString(secret))
    // console.log('HashLock: ', bufferToString(hashLock))

    const command = new RedeemDeposit(contractId, secret)
    const result = await redeemDepositHandler.execute(command)

    console.log(result)
};

const bufferToString = (b: Buffer) => '0x' + b.toString('hex')

main();

