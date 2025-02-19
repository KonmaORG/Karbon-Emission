// use aiken/crypto.{VerificationKeyHash}
// use cardano/assets.{PolicyId}
// use cardano/transaction.{OutputReference, Transaction}

validator truly_always_true {
  else(_) {
    fail
  }
}
// contract mints the CET based on redeemer.cet
// send tokens to userRepresentingScript with datum

// user_script(address): ref_token
// address: usr_token

// CET_minter() input usr_token -- ref_input ref_token

// ---
// usr/ref token  policyid - tokenName usr_ ref_

// token vkh.10 digits + ref_token (datum{scriptaddress})

// type SKH = ByteArray
// datum: option<SKH>
// expect Some(datum)= datum
// datum == "vkh.slice(10)"
