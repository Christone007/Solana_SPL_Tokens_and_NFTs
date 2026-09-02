import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { update, mplCore, fetchAssetV1 } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());
const asset = publicKey('B1zeQGnmLgmKA6wc1mKTDkwNoeZ2xNDrw6ZqZiL8o1h5');

(async () => {
    try {

        // fetching the existing asset
        console.log(`Fetching the existing asset with public key: ${asset}`);
        const assetAccount = await fetchAssetV1(umi, asset);
        console.log(`Fetched asset account: ${assetAccount.publicKey}`);

        console.log(`Updating the NFT asset's metadata with new name and URI...`);


        // updating the NFT asset's metadata
        const result = await update(umi, {
            asset: assetAccount,
            name: "ChristoneMobile Logo v1",
            uri: "https://gateway.irys.xyz/3eUL9pji4D1xKP4vryRVH1pneYuCpJki8QYfyXS7Z84F",            
        }).sendAndConfirm(umi);

        const signature = base58.deserialize(result.signature)[0];

        console.log(`Updated NFT asset's metadata successfully, Tx Signature: ${signature}`);

    } catch (e) {
        console.log(`error ${e}`);
    }
})();