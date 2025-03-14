use aiken/collection/list
use cardano/address.{Address, Inline, Script, VerificationKey}
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Input, Output, Transaction}
use cardano/value
use types.{AddressTuple, PaymentKeyHash, StakeKeyHash}
use types/token.{Token}
use validation/payout

pub fn script_address_from_tuple(key_hash_tuple: (PaymentKeyHash, StakeKeyHash)) {
  let (pkh, skh) = key_hash_tuple
  Address {
    payment_credential: pkh |> Script,
    stake_credential: if skh == "" {
      None
    } else {
      skh |> Script |> Inline |> Some
    },
  }
}

pub fn script_address_check(
  outputs: List<Output>,
  policy_id: PolicyId,
  token_name: ByteArray,
  redeemer: AddressTuple,
) {
  expect Some(output) =
    list.find(
      outputs,
      fn(o) { assets.quantity_of(o.value, policy_id, token_name) == 1 },
    )
  let address_data: Data = redeemer
  expect InlineDatum(address_datum) = output.datum
  and {
    output.address == script_address_from_tuple(redeemer),
    address_datum == address_data,
  }
}

pub fn find_ref_input(inputs: List<Input>, policy_id: PolicyId) {
  expect Some(input) =
    list.find(
      inputs,
      fn(i) { list.has(i.output.value |> assets.policies, policy_id) },
    )
  input
}

// pub fn find_output_with_address(outputs: List<Output>, address: Address) {
//   expect Some(output) = list.find(outputs, fn(o) { o.address == address })
//   output
// }

pub fn must_have_one_output_with_policy(
  outputs: List<Output>,
  policy_id: PolicyId,
  address: Address,
) {
  list.count(
    outputs,
    fn(o) {
      and {
        list.has(o.value |> assets.policies, policy_id),
        o.address == address,
      }
    },
  ) == 1
}

pub fn must_send_remaining_token_to_addr(
  tx: Transaction,
  cet_pid: PolicyId,
  cot_pid: PolicyId,
  cet_tkn: ByteArray,
  cot_tkn: ByteArray,
  burn_qty: Int,
  user_script: Address,
) {
  // let value = concat_inputs_value(inputs, assets.zero)
  let (cet_qty, cot_qty) =
    do_total_token_amount(tx.inputs, cet_pid, cot_pid, cet_tkn, cot_tkn, 0, 0)

  let o_cet = cet_qty + burn_qty
  let o_cot = cot_qty + burn_qty
  // let expected_output =
  //   when (o_cet, o_cot) is {
  //     (0, 0) -> value.from_token(Token { pid: "", tkn: "", amt: 1 })
  //     (qty, 0) ->
  //       value.from_tokens(
  //         [Token { pid: cet_pid, tkn: cet_tkn, amt: qty + burn_qty }],
  //       )
  //     (0, qty) ->
  //       value.from_tokens(
  //         [Token { pid: cot_pid, tkn: cot_tkn, amt: qty + burn_qty }],
  //       )
  //     (cet_qty, cot_qty) ->
  //       value.from_tokens(
  //         [
  //           Token { pid: cet_pid, tkn: cet_tkn, amt: cet_qty + burn_qty },
  //           //burn_qty is negative value
  //           Token { pid: cot_pid, tkn: cot_tkn, amt: cot_qty + burn_qty },
  //         ],
  //       )
  //   }
  if o_cet == 0 && o_cot == 0 {
    True
  } else {
    let expected_output =
      value.from_tokens(
        [
          Token { pid: cet_pid, tkn: cet_tkn, amt: o_cet },
          //burn_qty is negative value
          Token { pid: cot_pid, tkn: cot_tkn, amt: o_cot },
        ],
      )
    payout.at_least(user_script, expected_output, tx.outputs)?
  }
}

// pub fn concat_inputs_value(inputs: List<Input>, left: Value) {
//   when inputs is {
//     [input, ..rest] ->
//       concat_inputs_value(rest, assets.merge(left, input.output.value))
//     [] -> left
//   }
// }

fn do_total_token_amount(
  inputs: List<Input>,
  cet_pid: PolicyId,
  cot_pid: PolicyId,
  cet_tkn: ByteArray,
  cot_tkn: ByteArray,
  cet_qty: Int,
  cot_qty: Int,
) {
  when inputs is {
    [input, ..rest] -> {
      let cet_amt: Int =
        assets.quantity_of(input.output.value, cet_pid, cet_tkn)
      let cot_amt: Int =
        assets.quantity_of(input.output.value, cot_pid, cot_tkn)
      do_total_token_amount(
        rest,
        cet_pid,
        cot_pid,
        cet_tkn,
        cot_tkn,
        cet_qty + cet_amt,
        cot_qty + cot_amt,
      )
    }
    [] -> (cet_qty, cot_qty)
  }
}

pub fn get_output_addr(script: PolicyId, inputs: List<Input>) {
  expect Some(input) = list.head(inputs)
  when input.output.address.stake_credential is {
    Some(Inline(VerificationKey(skh))) ->
      address.from_script(script)
        |> address.with_delegation_key(skh)
    _ -> fail @"Input Stake Componenet Missing"
  }
}

pub fn user_script_address(inputs: List<Input>, outputs: List<Output>) {
  expect Some(input) = list.head(inputs)
  expect Some(Inline(VerificationKey(skh))) =
    input.output.address.stake_credential
  expect Some(output) = list.head(outputs)
  when (output.address.payment_credential, output.address.stake_credential) is {
    (Script(_), Some(Inline(VerificationKey(o_sk)))) ->
      if skh == o_sk {
        output
      } else {
        fail @"Incorrect Stake Component"
      }
    _ -> fail @"Incorrect Tokens Output Address"
  }
}
