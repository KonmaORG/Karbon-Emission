import { NETWORK } from "@/config";
import { CETMINTER, COTMINTER, USERSCRIPT } from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { CETDatum } from "@/types/cardano";
import {
  credentialToAddress,
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  stakeCredentialOf,
  validatorToAddress,
} from "@lucid-evolution/lucid";

export async function CetMinter(
  walletConnection: WalletConnection,
  datum: CETDatum
) {
  const { lucid, address } = walletConnection;
  try {
    if (!lucid || !address) throw new Error("Connect Wallet");
    const mintingPolicy = CETMINTER;
    const policyId = mintingPolicyToId(mintingPolicy);
    const tokens = { [policyId + fromText("Emision")]: datum.cet_qty };

    const cotMintingPolicy = COTMINTER();
    const cotPolicyId = mintingPolicyToId(cotMintingPolicy);

    const userScriptValidator = USERSCRIPT([policyId, cotPolicyId]);

    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );
    const reedemer = Data.to(datum, CETDatum);
    const utxo = (await lucid.utxosAt(address))[0];
    const tx = await lucid
      .newTx()
      .mintAssets(tokens, reedemer)
      .collectFrom([utxo])
      .pay.ToAddressWithData(
        userScriptAddress,
        { kind: "inline", value: reedemer },
        { lovelace: 1n, ...tokens }
      )
      .attach.MintingPolicy(mintingPolicy)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    return error;
  }
}
