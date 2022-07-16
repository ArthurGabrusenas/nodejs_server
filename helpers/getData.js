import fs from "fs";

function getData(path) {
  try {
    const data = fs.readFileSync(path, "utf8");

    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

export { getData };
