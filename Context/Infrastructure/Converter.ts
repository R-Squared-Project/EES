import Web3 from "web3";
import ConverterInterface from "context/Domain/ConverterInterface";

type EthWei = string
type RvEth = number

export default class Converter implements ConverterInterface {
    convert(eth: EthWei): RvEth {
        return parseFloat(Web3.utils.fromWei(eth))
    }
}
