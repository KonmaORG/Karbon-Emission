import { Constr, Data, WalletApi } from "@lucid-evolution/lucid";

/**
 * Wallet type definition
 */
export type Wallet = {
  name: string;
  icon: string;
  enable(): Promise<WalletApi>;
};

//#region Alias
export const PaymentKeyHashSchema = Data.Bytes();
export const StakeKeyHashSchema = Data.Bytes();

export const AddressSchema = Data.Tuple([
  PaymentKeyHashSchema,
  StakeKeyHashSchema,
]);
//#endregion

export const CETDatumSchema = Data.Object({
  location: Data.Bytes(),
  cet_qty: Data.Integer(),
  time: Data.Integer(),
});
export type CETDatum = Data.Static<typeof CETDatumSchema>;
export const CETDatum = CETDatumSchema as unknown as CETDatum;
// ---
export const ConfigSchema = Data.Object({
  cet_policyid: Data.Bytes(),
  cot_policyid: Data.Bytes(),
});
export type Config = Data.Static<typeof ConfigSchema>;
export const Config = ConfigSchema as unknown as Config;
