const { Apis, ChainConfig } = require("@revolutionpopuli/revpopjs-ws");

const config = {
    network_name: "RevPop",
    asset_name: "RVP",
    chain_id: "fdf2a77bf0076233ab95494d6e32889c3fc2f950ea0111b93c236316f6225741",
};

ChainConfig.networks[config.network_name] = {
    core_asset: config.asset_name,
    address_prefix: config.asset_name,
    chain_id: config.chain_id,
};

// Initialize revpop config
ChainConfig.setChainId(config.chain_id);

async function main() {
    const network = await connect("wss://sunflower-demo.axioma.lv:8090");
    console.log("Connected to network ", network);
    const ops = [
        [
            69,
            {
                fee: {
                    amount: "0",
                    asset_id: "1.3.0",
                },
                from: "1.2.77",
                to: "1.2.70",
                amount: {
                    amount: "100",
                    asset_id: "1.3.1",
                },
                preimage_hash: [2, "2b2ac1187c87ffcc9edfe0b89b1edaa0df996b59cf56f690fc7bef35f4ff4c49"],
                preimage_size: 32,
                claim_period_seconds: 4320,
                extensions: [],
            },
        ],
    ];
    const assetId = "1.3.0";

    const fees = await db_exec("get_required_fees", ops, assetId);
    console.log("fees ", fees);
    disconnect();
}

main().then(() => {
    console.log("Done");
    process.exit();
});

async function connect(connection_string) {
    const conn_res = await Apis.instance(
        connection_string, // cs
        true, // connect
        4000, // connectTimeout
        { enableCrypto: false, enableOrders: false }, // optionalApis
        () => {
            /*console.log(`Connection closed`)*/
        } // closeCb
    ).init_promise;
    const network = conn_res[0];
    if (network.network_name !== config.network_name) {
        throw new Error("Wrong blockchain network (chain ID mismatch)! Change it in the .env file.");
    }
    return network;
}

async function disconnect() {
    await Apis.close();
}

async function db_exec(name, ...params) {
    return await Apis.instance().db_api().exec(name, params);
}
