import {
  generateEmulatorAccount,
  Emulator,
  fromText,
} from "@lucid-evolution/lucid";
const cotToken = {
  ["0dbb7fe1d5c9bdadd2bfd43e4b65f60283334edeb0a39a89c690e2cd" +
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
