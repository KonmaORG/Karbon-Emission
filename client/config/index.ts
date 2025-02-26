import {
  Blockfrost,
  Network,
  PolicyId,
  Provider,
} from "@lucid-evolution/lucid";

export const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const NETWORK: Network = NETWORKx;
export const PROVIDER: Provider = new Blockfrost(BF_URL, BF_PID);
export const COTPOLICYID: PolicyId =
  "c51587c8961294b98b440c30ec96cdf9b4d7bde97a960c7cb62f3c78";
export const identificationPolicyid =
  "e2c8e87d4ed069180dfd507a7580d47896d5e1ad6f893a0c159b1ab5";
