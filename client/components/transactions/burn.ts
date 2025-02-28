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
  UTxO,
  validatorToAddress,
} from "@lucid-evolution/lucid";

export async function Burn(walletConnection: WalletConnection) {
  const qty = 10n; //burn qty
  const { lucid, address } = walletConnection;
  try {
    if (!lucid || !address) throw new Error("Connect Wallet");
    const cetMintingPolicy = CETMINTER;
    const cetPolicyId = mintingPolicyToId(cetMintingPolicy);
    const cotMintingPolicy = COTMINTER();
    const cotPolicyId = mintingPolicyToId(cotMintingPolicy);
    const userScriptValidator = USERSCRIPT([cetPolicyId, cotPolicyId]);
    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );

    const utxos = await lucid.utxosAt(userScriptAddress);

    const { outputTokens, cetBurn, cotBurn } = await cet_cot(
      utxos,
      qty,
      cetPolicyId,
      cotPolicyId
    );
    const refutxo = await refUtxo(lucid);

    const cetBurnRedeemer: BurnRedeemer = { cot_policyId: cotPolicyId };
    const cotBurnRedeemer: KarbonRedeemerMint = {
      action: "Burn",
      amount: 0n,
      oref: {
        transaction_id: utxos[0].txHash,
        output_index: BigInt(utxos[0].outputIndex),
      },
    };
    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom(utxos, Data.to(0n))
      .pay.ToAddress(userScriptAddress, {
        ...outputTokens,
      })
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
    const userScriptValidator = USERSCRIPT([cetPolicyId, cotPolicyId]);
    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );

    const utxos = await lucid.utxosAt(address);
    const { outputTokens } = await cet_cot(utxos, 0n, cetPolicyId, cotPolicyId);
    const cotOutputTokens = Object.entries(outputTokens)
      .filter(([key, value]) => key.startsWith(cotPolicyId))
      .reduce((acc: { [key: string]: bigint }, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const tx = await lucid
      .newTx()
      .pay.ToAddress(userScriptAddress, {
        lovelace: 1_000_000n,
        ...cotOutputTokens,
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

async function cet_cot(
  utxos: UTxO[],
  burnQty: bigint,
  cetPolicyId: string,
  cotPolicyId: string
) {
  // function to calculate the burn and output cet and cot tokens
  try {
    const original: { [key: string]: bigint } = {};
    const cetBurn: { [key: string]: bigint } = {};
    const cotBurn: { [key: string]: bigint } = {};
    let cetBurned = 0n;
    let cotBurned = 0n;
    for (const utxo of utxos) {
      for (const [asset, amount] of Object.entries(utxo.assets)) {
        const assetKey = asset;
        const assetValue = amount;

        original[assetKey] = (original[assetKey] || 0n) + assetValue;

        if (assetKey.startsWith(cetPolicyId) && cetBurned === 0n) {
          const burnValue = burnQty > assetValue ? assetValue : BigInt(burnQty);
          cetBurn[assetKey] = -burnValue;
          original[assetKey] -= burnValue;
          cetBurned = -burnValue;
          original[assetKey] === 0n && delete original[assetKey];
        } else if (assetKey.startsWith(cotPolicyId) && cotBurned === 0n) {
          const burnValue = burnQty > assetValue ? assetValue : BigInt(burnQty);
          cotBurn[assetKey] = -burnValue;
          original[assetKey] -= burnValue;
          cotBurned = -burnValue;
          original[assetKey] === 0n && delete original[assetKey];
        }
      }
    }
    return { outputTokens: original, cetBurn, cotBurn };
  } catch (error: any) {
    throw error;
  }
}
