import ConverterInterface from "context/Domain/ConverterInterface";
import { Injectable } from "@nestjs/common";
import config from "context/config";

type Eth = number;
type RvEth = number;

@Injectable()
export default class EtherToWrappedEtherConverter implements ConverterInterface {
    convert(eth: Eth): RvEth {
        return eth / config.revpop.eth_to_rveth_rate;
    }
}
