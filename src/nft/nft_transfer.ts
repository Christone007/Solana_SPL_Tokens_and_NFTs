import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { transfer, mplCore, fetchAssetV1 } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());
const asset = publicKey('B1zeQGnmLgmKA6wc1mKTDkwNoeZ2xNDrw6ZqZiL8o1h5');
const newOwner = publicKey('89Db5oCdmTCA45yZ1XmYRD5fT55jsJADEVBk8Lk2UtoQ');

(async () => {
    try {

        // fetching the existing asset
        console.log(`Fetching the existing asset with public key: ${asset}`);
        const assetAccount = await fetchAssetV1(umi, asset);
        const oldOwner = assetAccount.owner;
        console.log(`Fetched asset account: ${assetAccount.publicKey} Current owner: ${assetAccount.owner}`);

        console.log(`Transfering the NFT to new owner: ${newOwner}...`);


        // transfering the NFT asset to a new owner
        const result = await transfer(umi, {
            asset: assetAccount,
            newOwner: newOwner,    
        }).sendAndConfirm(umi, {send: {commitment: "finalized"}, confirm: {commitment: "finalized"}});

        const signature = base58.deserialize(result.signature)[0];

        const assetAccount2 = await fetchAssetV1(umi, asset);
        const updatedOwner = assetAccount2.owner;
        if (oldOwner !== updatedOwner) {
            console.log(`NFT Transferred successfully:, Tx Signature: ${signature}. New Owner: ${updatedOwner}`);
        }

    } catch (e) {
        console.log(`error ${e}`);
    }
})();