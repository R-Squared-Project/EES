import {Injectable} from "@nestjs/common";

@Injectable()
export default class AssetConverter {
    public toAsset (value: string, asset: any): number {
        return parseInt(value) / Math.pow(10, asset.get("precision"));
    }

    public fromAsset (value: number, asset: any): string {
        return (value * Math.pow(10, asset.get("precision"))).toString();
    }
}
