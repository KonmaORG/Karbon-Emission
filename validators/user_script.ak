use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction, find_input}
use config
use types.{CETDatum}
use utils

// all the offsetting will be done from this contract

validator user_script(_address: Data, cet_policyid: PolicyId) {
  spend(
    _datum: Option<CETDatum>,
    redeemer: Int,
    oref: OutputReference,
    tx: Transaction,
  ) {
    let Transaction { inputs, outputs, mint, .. } = tx
    expect Some(self_input) = find_input(inputs, oref)
    when redeemer is {
      0 -> {
        expect [Pair(_, cet_qty)] =
          mint |> assets.tokens(cet_policyid) |> dict.to_pairs
        expect [Pair(_, cot_qty)] =
          mint |> assets.tokens(config.cot_policyid) |> dict.to_pairs
        and {
          // CET qty should be negative
          cet_qty < 0,
          // to burn CET qty === COT qty
          cet_qty == cot_qty,
          // sending the left over COT to user_script addr
          utils.must_have_one_output_with_policy(
            outputs,
            config.cot_policyid,
            self_input.output.address,
          ),
          // sending the left over CET to user_script addr
          utils.must_have_one_output_with_policy(
            outputs,
            cet_policyid,
            self_input.output.address,
          ),
        }
      }
      1 -> {
        // can withdraw COT 
        expect [Pair(_, cet_qty)] =
          self_input.output.value
            |> assets.tokens(cet_policyid)
            |> dict.to_pairs
        cet_qty < 0
      }
      _ -> fail @"invalid redeemer value"
    }
  }

  else(_) {
    fail
  }
}
