// use aiken/crypto.{VerificationKeyHash}
// use cardano/assets.{PolicyId}
// use cardano/transaction.{OutputReference, Transaction}

validator user_script(_address: Data) {
  else(_) {
    fail
  }
}
