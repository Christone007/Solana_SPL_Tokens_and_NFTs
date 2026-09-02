import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";

//paste your mint address got from spl_init.ts
const mint = publicKey("E9hEjM9x1qgVRXETtzTBVEkc6pFhDqhQfWkHspWjcgBo");

const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    const accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
    };

    //change the metadata
    const data: DataV2Args = {
      name: "ChristoneMobile",
      symbol: "CRM",
      uri:"https://gateway.irys.xyz/DYpBrEoV1aaFKvNspt1eqBLJJTZCzd9N5g4LCWnu3dgV",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    }

    const args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    }

    const tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    const result = await tx.sendAndConfirm(umi);
    console.log("signature: ", bs58.encode(Buffer.from(result.signature)));

  } catch (error) {
    console.log("error", error);
  }
})();

// HAVzb69rRSNnNZZCPsXZPVdDQ2fBBRk98Vy9kVXBF7bH9TJQWFb1XHhCMbof1ksdo7U7hLAZkcKdHiUh1ugGhKA

// 2VQa6zmi5pDq58kDPs5KKM5jrVvUNsaaQmBgz49XD4D6a3B4g2fQW9guz6wVP5jcg7yFc7QEBX6RF5pEM8pNEx92