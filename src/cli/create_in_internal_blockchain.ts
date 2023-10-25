import yargs from "yargs";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import CreateContractInInternalBlockchain from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchain/CreateContractInInternalBlockchain";
import CreateContractInInternalBlockchainHandler from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchain/CreateContractInInternalBlockchainHandler";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import AssetNormalizer from "Context/Infrastructure/AssetNormalizer";

const argv = yargs(process.argv.slice(2))
    .option("id", {
        alias: "i",
        describe: "Deposit id",
        type: "string",
    })
    .demandOption(["id"])
    .help()
    .parseSync();

const depositId = argv.id;

const main = async () => {
    const depositRepository = new DepositTypeOrmRepository(DataSource);
    const internalBlockchain = await InternalBlockchain.init({
        repository: "native",
    });
    const externalBlockchain = new ExternalBlockchain("ethereum");
    const converter = new EtherToWrappedEtherConverter();
    const handler = new CreateContractInInternalBlockchainHandler(
        depositRepository,
        internalBlockchain,
        externalBlockchain,
        converter,
        new AssetNormalizer()
    );

    const command = new CreateContractInInternalBlockchain(depositId);
    await handler.execute(command);

    internalBlockchain.disconnect();
};

main().then(() => {
    console.log(`Create in internal blockchain: Internal HTLC for deposit ${depositId} was created.`);
});
