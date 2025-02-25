import { NETWORK } from "@/config";
import { CETMINTER, COTMINTER, USERSCRIPT } from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { refUtxo } from "@/lib/utils";
import { BurnRedeemer, KarbonRedeemerMint } from "@/types/cardano";
import {
  credentialToAddress,
  Data,
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
    console.log(cotPolicyId);
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

    const cetBurnRedeemer: BurnRedeemer = { cot_policyId: cotPolicyId };
    const cotBurnRedeemer: KarbonRedeemerMint = {
      action: "Burn",
      amount: 0n,
      oref: {
        transaction_id: cet_utxos[0].txHash,
        output_index: BigInt(cet_utxos[0].outputIndex),
      },
    };
    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom([...cet_utxos, ...cot_utxos])
      //   .pay.ToAddress(userScriptAddress, {
      //     lovelace: 1_000_000n,
      //     ...cetBurn,
      //     ...cotBurn,
      //   })
      .mintAssets(cetBurn, Data.to(cetBurnRedeemer, BurnRedeemer))
      .mintAssets(cotBurn, Data.to(cotBurnRedeemer, KarbonRedeemerMint))
      .attach.MintingPolicy(cetMintingPolicy)
      .attach.MintingPolicy(cotMintingPolicy)
      .attach.Script(userScriptValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    return error;
  }
}

export async function CotFromUserToScript(walletConnection: WalletConnection) {
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

    const tx = await lucid
      .newTx()
      .pay.ToAddress(userScriptAddress, {
        lovelace: 1_000_000n,
        [cotPolicyId + fromText("Emision")]: 10n,
      })
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}
