import { identificationPolicyid, NETWORK } from "@/config";
import { ConfigDatumHolderValidator } from "@/config/scripts/scripts";
import {
  fromText,
  LucidEvolution,
  mintingPolicyToId,
  Script,
  Validator,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(error: any) {
  // const { info, message } = error;

  function toJSON(error: any) {
    try {
      const errorString = JSON.stringify(error);
      const errorJSON = JSON.parse(errorString);

      return errorJSON;
    } catch {
      return {};
    }
  }

  const { cause } = toJSON(error);
  const { failure } = cause ?? {};

  const failureCause = failure?.cause;
  // const failureInfo = failureCause?.info;
  // const failureMessage = failureCause?.message;

  // toast(`${failureInfo ?? failureMessage ?? info ?? message ?? error}`, {
  // type: "error",
  // });
  console.error(failureCause ?? { error });
}

export function getPolicyId(validatorFunction: { (): Validator; (): Script }) {
  const validator: Validator = validatorFunction();
  const policyID = mintingPolicyToId(validator);
  return policyID;
}

export function getAddress(validatorFunction: { (): Validator; (): Script }) {
  const validator: Validator = validatorFunction();
  const address = validatorToAddress(NETWORK, validator);
  return address;
}

export async function refUtxo(lucid: LucidEvolution) {
  const address = getAddress(ConfigDatumHolderValidator);
  const ref_configNFT =
    identificationPolicyid + fromText("KarbonIdentificationNFT");
  const utxos = await lucid.utxosAtWithUnit(address, ref_configNFT);

  return utxos;
}
