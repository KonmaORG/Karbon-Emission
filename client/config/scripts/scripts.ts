import { applyDoubleCborEncoding, Validator } from "@lucid-evolution/lucid";

import { truly_always_true_truly_always_true_else } from "./plutus";

const truly_AlwaysTrue_else = applyDoubleCborEncoding(
  truly_always_true_truly_always_true_else
);

export const trulyAlwaysTrue: Validator = {
  type: "PlutusV3",
  script: truly_AlwaysTrue_else,
};
