use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Transaction}
use types.{CETDatum}
use utils

validator cet_minter(user_token_policy: PolicyId) {
  mint(redeemer: CETDatum, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, reference_inputs, outputs, .. } = tx
    let CETDatum { cet_qty, .. } = redeemer

    expect [Pair(token_name, qty)] =
      mint |> assets.tokens(policy_id) |> dict.to_pairs
    let ref_input = utils.find_ref_input(reference_inputs, user_token_policy)
    expect [Pair(ref_token_name, 1)] =
      ref_input.output.value
        |> assets.tokens(user_token_policy)
        |> dict.to_pairs
    let cet_output =
      utils.find_output_with_address(outputs, ref_input.output.address)
    expect InlineDatum(datum_data) = cet_output.datum
    let redeemer_data: Data = redeemer
    and {
      qty == cet_qty,
      assets.quantity_of(cet_output.value, policy_id, token_name) == qty,
      utils.token_name_must_be_vkh(inputs, ref_token_name),
      datum_data == redeemer_data,
    }
  }

  // QUESTION: what should be CET token Name
  else(_) {
    fail
  }
}
