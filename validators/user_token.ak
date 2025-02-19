use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use types.{AddressTuple}
use utils

validator user_token {
  mint(redeemer: AddressTuple, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, outputs, .. } = tx
    expect [Pair(ref, 1)] = mint |> assets.tokens(policy_id) |> dict.to_pairs
    and {
      utils.token_name_must_be_vkh(inputs, ref),
      utils.script_address_check(outputs, policy_id, ref, redeemer),
    }
  }

  else(_) {
    fail
  }
}
