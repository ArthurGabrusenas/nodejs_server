import { mockDataPath } from "../mock-data/index.js";
import { getData } from "./getData.js";

function getUserData() {
  return getData(mockDataPath.users).users;

  //TODO если пустой файл то возвращаем валидную структуру, переделать структуру users.json
  // return {
  //   'users': [],
  // }
}

export { getUserData };
