import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { burn, mplCore, fetchAssetV1 } from "@metaplex-foundation/mpl-core";
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

        console.log(`Burning the NFT..`);


        // uBurn the NFT
        const result = await burn(umi, {
            asset: assetAccount
        }).sendAndConfirm(umi, {send: {commitment: "finalized"}, confirm: {commitment: "finalized"}});

        const signature = base58.deserialize(result.signature)[0];

        console.log(`NFT destroyed successfully:, Tx Signature: ${signature}`);
        console.log(`Fetching the asset account after burn to verify... this should return an error if the burn was successful.`);
        const assetAccount2 = await fetchAssetV1(umi, asset);
        console.log(assetAccount2);
        

    } catch (e) {
        console.log(`error ${e}`);
    }
})();