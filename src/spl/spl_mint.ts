import {
  address,
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import wallet from "../../devnet-wallet.json";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstructionAsync,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

const token_decimals = 1_000_000n;

//paste your mint address got from spl_init.ts
const mint = address("E9hEjM9x1qgVRXETtzTBVEkc6pFhDqhQfWkHspWjcgBo");

(async () => {
  try {
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(wallet));

    const [ata] = await findAssociatedTokenPda({
      mint,
      owner: signer.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    console.log(`Your ata is : ${ata}`);

    const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
      payer: signer,
      owner: signer.address,
      mint: mint,
      ata: ata,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    const mintToIx = getMintToInstruction({
      mint: mint,
      token: ata,
      mintAuthority: signer,
      amount: 400n * token_decimals,
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const msg = createTransactionMessage({ version: 0 });

    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);

    const msgWithLifetime = setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      msgWithPayer,
    );

    const txMessage = appendTransactionMessageInstructions(
      [createAtaIx, mintToIx],
      msgWithLifetime,
    );

    const signedTx = await signTransactionMessageWithSigners(txMessage);

    assertIsTransactionWithBlockhashLifetime(signedTx);

    const signature = getSignatureFromTransaction(signedTx);

    const sendAndConfirm = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions,
    });

    await sendAndConfirm(signedTx, { commitment: "confirmed" });

    console.log(`mint txid: ${signature}.`);

  } catch (error) {
    console.log(error);
  }
})();

// Your ata is : D6hPkBuNeeXv7BTPH4VYnD7tfK5CyXJ9EXGgwnzVzcAx
// mint txid: 4aGBwy6Y59RU3HHADzvoH4ezuE78fwVaZg4KGUX4U7hjdezpRSwZHyFsRrEzhrEn1Xx45ZWdNWzhCoPLeA5ToE1a.

// Your ata is : BcQkByAbjyd7V7GxjnUbpkYVpVNfdiHPqSu1RRKSvQt6
// mint txid: 5Xoxe23HPnnHg4waqfpxg6vr1qTcyMbYn4TZs7dg4QrRfqRdrMkJKvRGS6KJHeGFDAFWFkNggb6k2cchxNw1Eswv.