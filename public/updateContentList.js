const recursive = require('recursive-readdir');
const fs = require('fs');
const fileContent = fs.readFileSync('./service-worker.js', 'utf8').split('\n');
let fileList = '', outputFileName = './output.js';
fs.writeFile(outputFileName, '', function(err, result) {
  if(err) console.log('error', err);
  recursive('./content/').then((files) => {
    files.map((f) => {
      fileList += "  '/" + f + "',\n";
    });
    fileList = fileList.substr(0, fileList.length-2);
    let inContentList = false;
    fileContent.map(
      (line) => {
        if (line.indexOf('///// Automatically generated code /////') !== -1) {
          inContentList = true;
          fs.appendFileSync(outputFileName, line.toString() + "\n");
          fs.appendFileSync(outputFileName, fileList + "\n"); 
        } else if (line.indexOf('///// End of automatically generated code /////') !== -1) {
          inContentList = false;
        }
        if (!inContentList) {
          fs.appendFileSync(outputFileName, line.toString() + "\n");
        }
      }
    );
  });
});


