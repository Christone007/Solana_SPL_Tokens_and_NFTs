import {
  address,
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
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

//paste your mint address got from spl_init.ts
const mint = address("E9hEjM9x1qgVRXETtzTBVEkc6pFhDqhQfWkHspWjcgBo");

//paste the address of the recipient
const to = address("89Db5oCdmTCA45yZ1XmYRD5fT55jsJADEVBk8Lk2UtoQ");

(async () => {
  try {
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(wallet));
    const sendAndConfirm = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions,
    });

    const [fromAta] = await findAssociatedTokenPda({
      mint,
      owner: signer.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    console.log(`Your fromAta is : ${fromAta}`);

    const [toAta] = await findAssociatedTokenPda({
      mint,
      owner: to,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    console.log(`Your toAta is : ${toAta}`);

    const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
      payer: signer,
      owner: to,
      mint: mint,
      ata: toAta,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    })

    const transferTx = await getTransferCheckedInstruction({
      source: fromAta,
      destination: toAta,
      mint: mint,
      authority: signer,
      amount: 2n * 1_000_000n,
      decimals: 6,
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const msg = createTransactionMessage({ version: 0 });

    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);

    const msgWithLiftime = setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      msgWithPayer,
    );

    const txMessage = appendTransactionMessageInstructions(
      [createAtaIx, transferTx],
      msgWithLiftime,
    );

    const signedTx = await signTransactionMessageWithSigners(txMessage);

    assertIsTransactionWithBlockhashLifetime(signedTx);

    const signature = getSignatureFromTransaction(signedTx);

    await sendAndConfirm(signedTx, { commitment: "confirmed" });

    console.log(`Transfer txid: ${signature}`);

  } catch (error) {
    console.log(error);
  }
})();

// Your fromAta is : D6hPkBuNeeXv7BTPH4VYnD7tfK5CyXJ9EXGgwnzVzcAx
// Your toAta is : 8oNbxwiNLFuVL2ooYDMSvfnsq2YmfJ5bEpTYCXWiRnXc
// mint txid: 5eWbiwBYPHFcwN1Ek6syE7pny8dQWhMDdPSKL3Yr1vAt9mbbPCozJEg1qPABTzHVabmfEYqKF69Uj8cgzVtLaYXj