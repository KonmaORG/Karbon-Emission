use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction, find_input}
use config
use types.{CETDatum}
use utils

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
          cet_qty < 0,
          cet_qty == cot_qty,
          utils.must_have_one_output_with_policy(
            outputs,
            config.cot_policyid,
            self_input.output.address,
          ),
          utils.must_have_one_output_with_policy(
            outputs,
            cet_policyid,
            self_input.output.address,
          ),
        }
      }
      1 -> {
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
