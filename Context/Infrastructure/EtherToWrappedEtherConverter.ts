import Web3 from "web3";
import ConverterInterface from "context/Domain/ConverterInterface";
import {Injectable} from "@nestjs/common";

type EthWei = string
type RvEth = number

@Injectable()
export default class EtherToWrappedEtherConverter implements ConverterInterface {
    convert(eth: EthWei): RvEth {
        return parseFloat(Web3.utils.fromWei(eth))
    }
}
