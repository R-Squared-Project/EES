import AssetConverter from "context/Infrastructure/AssetConverter";
import {expect} from "chai";

describe('AssetConverter', () => {
    describe('success', () => {
        const converter = new AssetConverter();
        const asset = {
            get: (name: string) => {
                if (name == "precision") {
                    return 14;
                }

                return null;
            }
        }

        it ('should convert 100000000000000 ETHWei to 1 RVETH', () => {
            expect(converter.toAsset('100000000000000', asset)).equals(1)
        })

        it ('should convert 1 RVETH to 100000000000000 ETHWei', () => {
            expect(converter.fromAsset(1, asset)).equals('100000000000000')
        })
    })
})
