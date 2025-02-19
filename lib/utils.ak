use aiken/collection/list
use aiken/primitive/bytearray
use cardano/address.{Address, Inline, Script, VerificationKey}
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Input, Output}
use types.{AddressTuple, PaymentKeyHash, StakeKeyHash}

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

pub fn token_name_must_be_vkh(inputs: List<Input>, token_name: ByteArray) {
  list.any(
    inputs,
    fn(i) {
      when i.output.address.payment_credential is {
        VerificationKey(vkh) -> bytearray.slice(vkh, 18, 27) == token_name
        _ -> False
      }
    },
  )
}
