import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());

(async () => {
  try {
    const metadataUri =
      "https://gateway.irys.xyz/BKV5uqHgdTr16nEz2N19iY7ExpADoMg5VVD46prr1Q7Q";

    const asset = generateSigner(umi);

    //add you nft name and metadata uri
    const tx = await create(umi, {
      asset: asset,
      name: "Christone NFT#1",
      uri: metadataUri,
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];

    console.log(`signature ${signature} , asset : ${asset.publicKey}`);

  } catch (e) {
    console.log(`errior ${e}`);
  }
})();


// signature 2TFM2Mt6q3guW5YtDWrYUBecAUHr5LJNz8BmeCA9KACnefxWVe2qTeVh2NLykyCmq7pGdyGRndzcomKdC3u3wLwP,
// asset : A8yneWvfqKcs7q9Z1K3duPUUTXytz1ZKfhQg8t5VET6P
