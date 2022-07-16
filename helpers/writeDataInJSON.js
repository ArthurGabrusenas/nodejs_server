import fs from "fs";

function writeDataInJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data), "utf8", (err) => {
    if (err) {
      throw err;
    }
  });
}

export { writeDataInJSON };
