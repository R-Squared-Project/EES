import {Command, CommandRunner} from "nest-commander";
import Path from "path";
import Axios from "axios";
import Fs from "fs";
import dayjs from "dayjs";

@Command({
    name: "update-sanctioned-addresses",
    description: "Update Sanctioned Addresses from Github",
})
export class UpdateSanctionedAddresses extends CommandRunner {
    async run(): Promise<void> {
        const url = 'https://raw.githubusercontent.com/0xB10C/ofac-sanctioned-digital-currency-addresses/lists/sanctioned_addresses_ETH.json'
        const path = Path.resolve(__dirname, '../../../src/assets/SanctionedAddresses/', 'sanctioned_addresses_ETH_'+ dayjs().format('YYYY-MM-DD') +'.json')
        const usagePath = Path.resolve(__dirname, '../../../src/assets/SanctionedAddresses/', 'sanctioned_addresses_ETH.json')
        await this.downloadFile(url, path);
        Fs.cpSync(path, usagePath);
        console.log('Sanctioned Addresses updated');
        this.cleanUp();
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
                if (!this.validateFile(path)) {
                    Fs.unlinkSync(path);
                    reject();
                }
                resolve()
            })

            response.data.on('error', () => {
                reject()
            })
        })
    }

    private async validateFile(path: string): Promise<void> {
        if (!Fs.existsSync(path)) {
            throw new Error("File not found");
        }

        const data = Fs.readFileSync(path, 'utf8');
        const json = JSON.parse(data);
        if (!json) {
            throw new Error("Invalid JSON");
        }
        if(json && json.length === 0){
            throw new Error("Empty JSON");
        }
        if (!Array.isArray(json)) {
            throw new Error("Invalid JSON");
        }
        for (let i = 0; i < json.length && i < 3; i++) {
            if (typeof json[i] !== "string") {
                throw new Error("Invalid JSON");
            }
            if (json[i].length !== 42) {
                throw new Error("Invalid JSON");
            }
            if(json[i].substring(0,2) !== '0x'){
                throw new Error("Invalid JSON");
            }
        }
    }

    private cleanUp(): void {
        const files: string[] = [];
        Fs.readdirSync(Path.resolve(__dirname, '../../../src/assets/SanctionedAddresses/')).forEach((file) => {
            if(file !== 'sanctioned_addresses_ETH.json') {
                files.push(file);
            }

        });
        files.sort().splice(-3, 3);

        for (const file of files) {
            Fs.unlinkSync(Path.resolve(__dirname, '../../../src/assets/SanctionedAddresses/', file));
        }
    }

}
