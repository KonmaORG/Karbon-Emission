import { Burn, CotFromUserToScript } from "@/components/transactions/burn";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/walletContext";
import React from "react";

export default function BurnPage() {
  const [WalletConnection] = useWallet();
  async function BurnClient() {
    const result = await Burn(WalletConnection);
    console.log(result);
  }

  async function transferToken() {
    const result = await CotFromUserToScript(WalletConnection);
    console.log(result);
  }
  return (
    <div className="flex gap-2">
      <Button onClick={BurnClient}>Burn</Button>
      <Button onClick={transferToken}>transferToken</Button>
    </div>
  );
}
