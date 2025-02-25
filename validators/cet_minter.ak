use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Transaction}
use types.{CETDatum}
use utils

/// CET Minter =  this will mint the CET token that is emitted from the factory
validator cet_minter {
  mint(redeemer: CETDatum, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, outputs, .. } = tx
    let CETDatum { cet_qty, .. } = redeemer
    // checking for minting tokens
    expect [Pair(token_name, qty)] =
      mint |> assets.tokens(policy_id) |> dict.to_pairs
    let cet_output = utils.user_script_address(inputs, outputs)
    trace @"........................."
    expect InlineDatum(datum_data) = cet_output.datum
    let redeemer_data: Data = redeemer
    and {
      // matching the CET qty coming from the redeemer (redeemr hvaing mock value for now)
      qty == cet_qty,
      // checking samw qty going to user_script
      assets.quantity_of(cet_output.value, policy_id, token_name) == qty,
      // check datum and redeemer is same 
      datum_data == redeemer_data,
    }
  }

  // QUESTION: what should be CET token Name
  else(_) {
    fail
  }
}
