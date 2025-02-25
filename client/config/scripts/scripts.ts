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
import {
  config_datum_holder_config_datum_holder_spend,
  validator_contract_validator_contract_mint,
  validator_contract_validator_contract_mint_mint,
} from "./karbonLedger";
import { getPolicyId } from "@/lib/utils";
import { identificationPolicyid } from "..";

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

// ----
//------------------------------------------------------------------
const configdatumholderscript = applyDoubleCborEncoding(
  config_datum_holder_config_datum_holder_spend
);

export function ConfigDatumHolderValidator(): Validator {
  return {
    type: "PlutusV3",
    script: configdatumholderscript,
  };
}

const ValidatorContractScript = applyDoubleCborEncoding(
  validator_contract_validator_contract_mint
);
export function COTMINTER(): Validator {
  //config_nft : PolicyId; validator_contract_mint: PolicyId
  const validatorMinterParam = getPolicyId(ValidatorMinter);
  return {
    type: "PlutusV3",
    script: applyParamsToScript(ValidatorContractScript, [
      identificationPolicyid, //identification pid from karbon-ledger
      validatorMinterParam,
    ]),
  };
}

const ValidatorMinterScript = applyDoubleCborEncoding(
  validator_contract_validator_contract_mint_mint
);
export function ValidatorMinter(): Validator {
  //config_nft : PolicyId;
  return {
    type: "PlutusV3",
    script: applyParamsToScript(ValidatorMinterScript, [
      identificationPolicyid, //identification pid from karbon-ledger
    ]),
  };
}
