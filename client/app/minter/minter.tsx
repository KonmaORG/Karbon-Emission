"use Client";
import { CetMinter } from "@/components/transactions/minter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/walletContext";
import { Input } from "@heroui/input";
import { fromText } from "@lucid-evolution/lucid";
import React, { useState } from "react";

export default function Minter() {
  const [WalletConnection] = useWallet();
  const [qty, setQty] = useState("0");
  async function handleMint() {
    const result = await CetMinter(WalletConnection, {
      location: fromText("location"),
      cet_qty: BigInt(parseInt(qty)),
      time: 126935457738n,
    });
    console.log(result);
  }
  return (
    <div>
      <Input placeholder="Mint Quantity" value={qty} onValueChange={setQty} />
      <Button onClick={handleMint}>Mint</Button>
    </div>
  );
}
