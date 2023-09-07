import { Accounts } from "../types";
import fs from "fs";

try {
  var accounts: Accounts[] = JSON.parse(
    fs.readFileSync("./accounts.json").toString()
  );
} catch (error) {
  console.error(`Error parsing accounts file: ${error}`);
  process.exit(1);
}

export default accounts;
