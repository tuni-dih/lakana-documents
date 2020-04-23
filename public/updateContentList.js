const recursive = require('recursive-readdir');
const fs = require('fs');
const fileContent = fs.readFileSync('./service-worker.js', 'utf8').split('\n');
let fileList = "  '/content.json',\n", outputFileName = './service-worker.js';
fs.readFile('./content.json', (err, data) => {
  if (err) throw err;
  let content = JSON.parse(data);
  const appVersion = content['app-version'];
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
            if (line.toString().indexOf('applicationVersion =') !== -1) {
              fs.appendFileSync(outputFileName, `const applicationVersion = '${appVersion}'` + "\n");        
            } else {
              fs.appendFileSync(outputFileName, line.toString() + "\n");
            }
          }
        }
      );
    });
  });
});
