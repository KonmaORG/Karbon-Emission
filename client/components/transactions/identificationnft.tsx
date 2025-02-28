"use client";
import { IdentificationNFT_MintValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Identification() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  async function mint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const utxos = await lucid.utxosAt(address);
    const orefHash = String(utxos[0].txHash);
    const orefIndex = BigInt(utxos[0].outputIndex);
    const oref = new Constr(0, [orefHash, orefIndex]);
    // setORef(oref);
    // console.log(utxos)
    const mintingValidator: Validator = IdentificationNFT_MintValidator([oref]);
    const policyID = mintingPolicyToId(mintingValidator);
    const ref_assetName = "KarbonIdentificationNFT";
    const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n };
    // const redeemer = Data.to("Mint", IdentificationRedeemer);
    const mint = new Constr(0, []);
    const redeemer = Data.to(mint);

    const tx = await lucid
      .newTx()
      .collectFrom([utxos[0]])
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("-----------IdentificationNFT__Mint---------");
    console.log("policyId: ", policyID);
    console.log("txHash: ", txHash);
  }

  return (
    <div className="flex gap-4">
      <Button onClick={mint}>mint</Button>
    </div>
  );
}
