import ConverterInterface from "context/Domain/ConverterInterface";
import { Injectable } from "@nestjs/common";
import config from "context/config";

type Eth = number;
type RQETH = number;

@Injectable()
export default class EtherToWrappedEtherConverter implements ConverterInterface {
    convert(eth: Eth): RQETH {
        return eth / config.r_squared.eth_to_rqeth_rate;
    }
}
