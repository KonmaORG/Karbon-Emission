use aiken/collection/dict
use cardano/address.{Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction, find_input}
use config
use types.{CETDatum}
use utils

// all the offsetting will be done from this contract

validator user_script(cet_policyid: PolicyId) {
  spend(
    _datum: Option<CETDatum>,
    redeemer: Int,
    oref: OutputReference,
    tx: Transaction,
  ) {
    let Transaction { inputs, mint, .. } = tx
    expect Some(self_input) = find_input(inputs, oref)
    expect Script(script) = self_input.output.address.payment_credential
    when redeemer is {
      // burning CET==COT
      0 -> {
        expect [Pair(cet_tkn, cet_qty)] =
          mint |> assets.tokens(cet_policyid) |> dict.to_pairs
        expect [Pair(cot_tkn, cot_qty)] =
          mint |> assets.tokens(config.cot_policyid) |> dict.to_pairs
        and {
          // CET qty should be negative
          cet_qty < 0,
          // to burn CET qty === COT qty
          cet_qty == cot_qty,
          // sending the left over COT to user_script addr
          utils.must_send_remaining_token_to_addr(
            tx,
            cet_policyid,
            config.cot_policyid,
            cet_tkn,
            cot_tkn,
            cot_qty,
            utils.get_output_addr(script, inputs),
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
