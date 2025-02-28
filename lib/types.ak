use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{PolicyId}

pub type PaymentKeyHash =
  VerificationKeyHash

pub type StakeKeyHash =
  VerificationKeyHash

pub type CETDatum {
  location: ByteArray,
  cet_qty: Int,
  time: Int,
}

pub type AddressTuple =
  (PaymentKeyHash, StakeKeyHash)

pub type Config {
  cet_policyid: PolicyId,
  cot_policyid: PolicyId,
}

pub type BurnRedeemer {
  cot_policyid: PolicyId,
}
