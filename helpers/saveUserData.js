import { mockDataPath } from "../mock-data/index.js";
import { writeDataInJSON } from "./writeDataInJSON.js";

function saveUserData(updatedUsers) {
  return writeDataInJSON(mockDataPath.users, updatedUsers);
}

export { saveUserData };
