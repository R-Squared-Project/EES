import {CommandRunner} from "nest-commander";
import Path from "path";
import Axios from "axios";
import Fs from "fs";

export class UpdateSanctionedAddresses extends CommandRunner {
    async run(): Promise<void> {
        const url = 'https://raw.githubusercontent.com/0xB10C/ofac-sanctioned-digital-currency-addresses/lists/sanctioned_addresses_ETH.json'
        const path = Path.resolve(__dirname, '../../../src/assets/SanctionedAddresses/', 'sanctioned_addresses_ETH_'+ new Date() +'.json')
        await this.downloadFile(url, path);
    }

    private async downloadFile(url: string, path: string): Promise<void> {
        const response = await Axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        })

        response.data.pipe(Fs.createWriteStream(path))

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve()
            })

            response.data.on('error', () => {
                reject()
            })
        })
    }

}
