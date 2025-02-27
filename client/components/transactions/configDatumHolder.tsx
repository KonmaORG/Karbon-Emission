import { useWallet } from "@/context/walletContext";
import {
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  SpendingValidator,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "../ui/button";
import {
  CETMINTER,
  ConfigDatumHolderValidator,
  COTMINTER,
} from "@/config/scripts/scripts";
import { identificationPolicyid, NETWORK } from "@/config";
import { ConfigDatum } from "@/types/cardano";

const CATEGORIES = [
  "forest",
  "water",
  "air",
  "forestration",
  "algae treatment",
];

export default function ConfigDatumHolder() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  async function deposit() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    try {
      const configNFT = {
        [identificationPolicyid + fromText("KarbonIdentificationNFT")]: 1n,
      };
      const validator: SpendingValidator = ConfigDatumHolderValidator();
      const contractAddress = validatorToAddress(NETWORK, validator);
      const validatorContract: SpendingValidator = COTMINTER();
      const validatorContractAddress = validatorToAddress(
        NETWORK,
        validatorContract
      );

      const cetMintingPolicy = CETMINTER;
      const cetPolicyId = mintingPolicyToId(cetMintingPolicy);
      const cotMintingPolicy = COTMINTER();
      const cotPolicyId = mintingPolicyToId(cotMintingPolicy);
      console.log("configDatum", contractAddress);
      console.log("cetPolicyId", cetPolicyId);
      console.log("cotPolicyId", cotPolicyId);
      const assestClass = {
        policyid: "",
        asset_name: fromText(""),
      };
      const signer = {
        required: 2n,
        signers: [paymentCredentialOf(address).hash],
      };
      // scriptHashToCredential
      const datum: ConfigDatum = {
        fees_address: paymentCredentialOf(address).hash,
        fees_amount: 100_000_000n,
        fees_asset_class: assestClass,
        spend_address: paymentCredentialOf(validatorContractAddress).hash,
        categories: CATEGORIES.map((category) => fromText(category)),
        multisig_validator_group: signer,
        multisig_refutxoupdate: signer,
        cet_policyid: cetPolicyId,
        cot_policyId: cotPolicyId,
      };
      const tx = await lucid
        .newTx()
        .pay.ToAddressWithData(
          contractAddress,
          { kind: "inline", value: Data.to(datum, ConfigDatum) },
          { lovelace: 5_000_000n, ...configNFT }
        )
        .complete();

      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("-------ConfigDatum__Deposite------------");
      console.log(
        "validatorhash",
        paymentCredentialOf(validatorContractAddress).hash
      );
      console.log("txHash: ", txHash);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex gap-4">
      <Button onClick={deposit}>send configDatum</Button>
    </div>
  );
}
