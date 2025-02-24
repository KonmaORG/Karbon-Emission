import { CetMinter } from "@/components/transactions/minter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/walletContext";
import { fromText } from "@lucid-evolution/lucid";
import React from "react";

export default function Minter() {
  const [WalletConnection] = useWallet();
  async function handleMint() {
    const result = await CetMinter(WalletConnection, {
      location: fromText("location"),
      cet_qty: 10n,
      time: 126935457738n,
    });
    console.log(result);
  }
  return (
    <>
      <Button onClick={handleMint}>Mint</Button>
    </>
  );
}
