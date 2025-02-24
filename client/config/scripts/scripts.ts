import {
  applyDoubleCborEncoding,
  applyParamsToScript,
  Data,
  Validator,
} from "@lucid-evolution/lucid";

import {
  cet_minter_cet_minter_mint,
  user_script_user_script_spend,
} from "./plutus";
import { Config } from "@/types/cardano";

const cet_minter_mint = applyDoubleCborEncoding(cet_minter_cet_minter_mint);

export const CETMINTER: Validator = {
  type: "PlutusV3",
  script: cet_minter_mint,
};

const user_script_spend = applyDoubleCborEncoding(
  user_script_user_script_spend
);

export const USERSCRIPT: (param: Config) => Validator = (param: Config) => {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(user_script_spend, [Data.to(param, Config)]),
  };
};
