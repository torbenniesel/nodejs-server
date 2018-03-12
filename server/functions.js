//'use strict';
console.log(__dirname);
console.log(__filename);

function getFile(path) {
  const filePath = `${__dirname}/public${path}`;
  try {
    const content = "fs.openSync(filePath, 'r');"
    return {
      content,
      headers: {
        'content-type': 'text'
      }
    };
  } catch (e) {
    console.log("functions.js - Catched error")
    return null;
  }
}

function myLog(){
  console.log("log",__dirname);
  console.log("log",__filename);
}


module.exports = {
  getFile,
  log,
}
