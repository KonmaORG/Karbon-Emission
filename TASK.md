### Project Flow

1. **Fetches Location**

   - Fetches the current location of User.

2. **Emission Data from Offchain DB**

   - Retrieves emission data from the offchain database.

3. **CET Contract**

   - The contract mints the required amount of CET tokens based on emission data.
   - Send the minted CET tokens to the `UserRepresentingScript` with associated datum:
     - Datum: `{location, CET, time}`

   **Functions in the Script:**

   a. **Redeemer Processing**

   - Take the redeemer and mint the specified quantity of CET tokens.
   - Send the minted CET tokens to the `UserRepresentingScript` with datum.

   b. **Match Datum with Redeemer**

   - The script matches the datum with the redeemer to verify the transaction.

4. **CET & COT on `UserRepresentingScript`**

   - The script handles the burning of CET and COT tokens.
   - The script burns the same amount of CET and COT tokens.
   - **Note**: CET tokens can only be burned and cannot be withdrawn. COT tokens can be spent.

5. **`UserRepresentingScript` execution**
   - **Temporary**: The burn process must be triggered manually.
   - **Later (Automated)**: The IOT wallet will automatically call this function every 24 hours or weekly.

---

### Transaction Example:

- `tx.new()`: Initiates a new transaction.
- `mintAssets(CET, redeemer: Datum + RedeeemerAction)`: Mint the CET tokens, attaching the datum and action.
- `sendToContract(address, datum, CET)`: Send the minted CET tokens to the `UserRepresentingScript` with datum.

---

### CET Script:

- Carbon Emission Token (CET) Script mints the CET for the carbon Emission
- send the token to `UserRepresentingScript`

### UserRepresentingScript

- This script will hold the CET and COT token for user
- The COT token purchased from the marketplace would also be sent to this contract
- `UserRepresentingScript` will take the parameters `address`, `Identification Details`
