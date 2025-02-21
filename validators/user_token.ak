use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use cardano/value
use types.{AddressTuple}
use utils

/// This will mint the Ref token that will send to user_script
validator user_token {
  mint(redeemer: AddressTuple, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, outputs, .. } = tx
    expect [Pair(ref, 1)] = mint |> assets.tokens(policy_id) |> dict.to_pairs
    and {
      // token name must be last 20 car of vkh
      // value.unique_token_name(tx,1,)
      utils.token_name_must_be_vkh(inputs, ref),
      //checking if output going to user_script addr with datum/redeemer
      utils.script_address_check(outputs, policy_id, ref, redeemer),
    }
  }

  else(_) {
    fail
  }
}
