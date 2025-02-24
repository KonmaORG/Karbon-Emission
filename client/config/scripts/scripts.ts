import { applyDoubleCborEncoding, Validator } from "@lucid-evolution/lucid";

import {
  cet_minter_cet_minter_mint,
  user_script_user_script_spend,
} from "./plutus";

const cet_minter_mint = applyDoubleCborEncoding(cet_minter_cet_minter_mint);

export const CETMINTER: Validator = {
  type: "PlutusV3",
  script: cet_minter_mint,
};

const user_script_spend = applyDoubleCborEncoding(
  user_script_user_script_spend
);

export const USERSCRIPT: Validator = {
  type: "PlutusV3",
  script: user_script_spend,
};
