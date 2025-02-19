use aiken/crypto.{VerificationKeyHash}

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
