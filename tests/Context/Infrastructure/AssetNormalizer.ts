import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import {expect} from "chai";

describe('AssetNormalizer', () => {
    describe('success', () => {
        const converter = new AssetNormalizer();
        const asset = {
            get: (name: string) => {
                if (name == "precision") {
                    return 18;
                }

                return null;
            }
        }

        it ('should normalize 1000000000000000000 ETHWei to 1 ETH', () => {
            expect(converter.normalize('1000000000000000000', asset)).equals(1)
        })

        it ('should denormalize 1 ETH to 1000000000000000000 ETHWei', () => {
            expect(converter.denormalize(1, asset)).equals('1000000000000000000')
        })
    })
})
