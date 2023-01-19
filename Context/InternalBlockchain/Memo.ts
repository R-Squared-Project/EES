// @ts-ignore
import { TransactionHelper } from "@revolutionpopuli/revpopjs";

export default class Memo {
    public generate(message: string, accountFrom: any, accountTo: any) {
        const fromPublicKey = this.getMemoPublicKey(accountFrom)
        const toPublicKey = this.getMemoPublicKey(accountTo)

        return {
            from: fromPublicKey,
            to: toPublicKey,
            nonce: TransactionHelper.unique_nonce_uint64(),
            message: message
        }
    }

    private getMemoPublicKey(account: any) {
        let publicKey = account.getIn(["options", "memo_key"]);
        if (/111111111111111111111/.test(publicKey)) {
            publicKey = null;
        }

        return publicKey;
    }
}
