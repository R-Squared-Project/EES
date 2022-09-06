import Web3 from "web3";
import SecretGeneratorInterface from "./SecretGeneratorInterface";

class Web3SecretGenerator implements SecretGeneratorInterface {
    generate(): string {
        return Web3.utils.randomHex(32);
    }
}

export default new Web3SecretGenerator()