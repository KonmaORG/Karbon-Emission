import { NETWORK } from "@/config";
import { CETMINTER, COTMINTER, USERSCRIPT } from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { refUtxo } from "@/lib/utils";
import {
  credentialToAddress,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  stakeCredentialOf,
  validatorToAddress,
} from "@lucid-evolution/lucid";

export async function Burn(walletConnection: WalletConnection) {
  const qty = -10n;
  const { lucid, address } = walletConnection;
  try {
    if (!lucid || !address) throw new Error("Connect Wallet");
    const cetMintingPolicy = CETMINTER;
    const cetPolicyId = mintingPolicyToId(cetMintingPolicy);
    const cotMintingPolicy = COTMINTER();
    const cotPolicyId = mintingPolicyToId(cotMintingPolicy);
    const userScriptValidator = USERSCRIPT({
      cet_policyid: cetPolicyId,
      cot_policyid: cotPolicyId,
    });
    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );

    const cet_utxos = await lucid.utxosAtWithUnit(
      userScriptAddress,
      cetPolicyId + fromText("Emision")
    );
    const cot_utxos = await lucid.utxosAtWithUnit(
      userScriptAddress,
      cotPolicyId + fromText("Emision")
    );

    const cetBurn = { [cetPolicyId + fromText("Emision")]: qty };
    const cotBurn = { [cotPolicyId + fromText("Emision")]: qty };
    const refutxo = await refUtxo(lucid);

    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom([...cet_utxos, ...cot_utxos])
      // .mintAssets(cetBurn, )
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    return error;
  }
}
