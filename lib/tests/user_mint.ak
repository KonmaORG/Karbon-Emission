use cardano/assets
use cardano/transaction.{OutputReference}
use mocktail/virgin_address.{mock_script_address}
use mocktail/virgin_key_hash.{mock_policy_id}
use tx_util/builder/txn
use utils

test must_send_cot_cet_back() {
  let cet_pid = mock_policy_id(1)
  let cot_pid = mock_policy_id(2)
  let cet_amt = 50
  let cot_amt = 100
  let cet_tkn = "cet_tkn"
  let cot_tkn = "cot_tkn"

  let address = mock_script_address(1, None)

  let oref =
    OutputReference(
      #"0000000000000000000000000000000000000000000000000000000000000064",
      0,
    )
  let i_value =
    assets.merge(
      assets.from_asset(cet_pid, cet_tkn, cet_amt),
      assets.from_asset(cot_pid, cot_tkn, cot_amt),
    )
  let o_value =
    // assets.merge(
    //   assets.from_asset(cet_pid, cet_tkn, 50),
    assets.from_asset(cot_pid, cot_tkn, 50)
  // )
  let b_value =
    assets.merge(
      assets.from_asset(cet_pid, cet_tkn, -50),
      assets.from_asset(cot_pid, cot_tkn, -50),
    )
  let input =
    txn.new_tx_input(oref, address)
      |> txn.with_asset_of_tx_input(i_value)

  let output =
    txn.new_tx_output(address)
      |> txn.add_asset_to_tx_output(o_value)

  // let mint = add_mint()
  let tx =
    transaction.placeholder
      |> txn.add_tx_input(input)
      |> txn.add_mint(b_value)
      |> txn.add_tx_output(output)

  // input with token
  // output must have  token_qty - burn
  utils.must_send_remaining_token_to_addr(
    tx,
    cet_pid,
    cot_pid,
    cet_tkn,
    cot_tkn,
    -50,
    address,
  )
}
