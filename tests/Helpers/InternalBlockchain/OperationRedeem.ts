import OperationRedeem from "context/InternalBlockchain/OperationRedeem";

// {
//     id: '1.11.1205898',
//     op: [
//       70,
//       {
//         fee: [Object],
//         htlc_id: '1.16.59',
//         redeemer: '1.2.75',
//         preimage: '62383561306539663739326362336139626337646337356664623162373935653931636639316666646461636338643738363936333830373962303238353062',
//         extensions: []
//       }
//     ],
//     result: [ 0, {} ],
//     block_num: 1119562,
//     trx_in_block: 2,
//     op_in_trx: 0,
//     virtual_op: 0
// }

// OperationRedeem {
//     _account: 'init10',
//     _htlcContractId: '1.16.59',
//     _secret: 'b85a0e9f792cb3a9bc7dc75fdb1b795e91cf91ffddacc8d7869638079b02850b',
//     _transactionId: '1.11.1205898'
//   }

const account = "native_account_name";
const internalContractId = "1.16.1";
const secret = "b85a0e9f792cb3a9bc7dc75fdb1b795e91cf91ffddacc8d7869638079b02850b";
const transactionId = "1.11.1205898";

interface Params {
    internalContractId?: string;
    secret?: string;
}

export function createOperationRedeem(params?: Params): OperationRedeem {
    return OperationRedeem.create(
        account,
        params?.internalContractId ?? internalContractId,
        params?.secret ?? secret,
        transactionId
    );
}
