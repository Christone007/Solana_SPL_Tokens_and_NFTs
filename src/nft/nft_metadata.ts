import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    //change the image uri to your image uri obtained from nft_image.ts
    const image = "https://gateway.irys.xyz/7tnMzY1QcrUMk159TWL9USdsvDoMEYAx7McY2sdTMtBv"; // image 1

      // const image = "https://gateway.irys.xyz/7tnMzY1QcrUMk159TWL9USdsvDoMEYAx7McY2sdTMtBv"; // image 2

    // json scheme : https://www.metaplex.com/docs/smart-contracts/core/json-schema
    //change the metadata
    const metadata = {
      "name" : "ChristoneMobile Logo v1",
      "symbol" : "CML",
      "description" : "ChristoneMobile Logo is a unique NFT representing the ChristoneMobile App on chain. It is a symbol of innovation and creativity in the digital space, showcasing the artistic vision of ChristoneMobile.",
      "image" : image,
      "category" : "image",
    }

    // update
    // const metadata = {
    //   "name" : "Christone NFT#2",
    //   "description" : "Christone NFT#2 is an update on Christone NFT series created by Christone in Turbin3 Builders program",
    //   "image" : image,
    //   "category" : "image",
    // }

    // upload metadata for spl token
    // const metadata = {
    //   "name": "ChristoneMobile",
    //   "symbol": "CRM",
    //   "description": "This is a Devnet token for the ChristoneMobile App accessible via https://christonemobile.com.ng",
    //   "image": "https://gateway.irys.xyz/7tnMzY1QcrUMk159TWL9USdsvDoMEYAx7McY2sdTMtBv",
    //   "attributes": [],
    //   "properties": {
    //     "files": [
    //       {
    //         "uri": "https://gateway.irys.xyz/7tnMzY1QcrUMk159TWL9USdsvDoMEYAx7McY2sdTMtBv",
    //         "type": "image/png"
    //       }
    //     ]
    //   }
    // }



    const myUri = await umi.uploader.uploadJson(metadata);
    console.log(`metadata uri: ${myUri} `);

  } catch (error) {
    console.log("error", error);
  }
})();


// original: https://gateway.irys.xyz/BKV5uqHgdTr16nEz2N19iY7ExpADoMg5VVD46prr1Q7Q 

// Update: https://gateway.irys.xyz/2LUTSpmT46RoTQgcczMg51ckMUp6Rd3c4AhE2vrKVWg6 

// SPL Token metadata uri: https://gateway.irys.xyz/DYpBrEoV1aaFKvNspt1eqBLJJTZCzd9N5g4LCWnu3dgV 