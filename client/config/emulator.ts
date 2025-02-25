import {
  generateEmulatorAccount,
  Emulator,
  fromText,
} from "@lucid-evolution/lucid";
const cotToken = {
  ["7ee78de62f0828150a49d487a5cbfa852079ff77e280a61917e4b630" +
  fromText("Emision")]: 10n,
};

export const accountA = generateEmulatorAccount({
  lovelace: 10_000_000_000n,
  ...cotToken,
});
export const accountB = generateEmulatorAccount({ lovelace: 10_000_000_000n });
export const accountC = generateEmulatorAccount({ lovelace: 10_000_000_000n });
export const accountD = generateEmulatorAccount({ lovelace: 10_000_000_000n });

export const emulator = new Emulator([accountA, accountB, accountC, accountD]);
