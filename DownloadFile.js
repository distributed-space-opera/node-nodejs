require('dotenv').config();
const fs = require('fs');
const util = require('util')
splitSync = require('node-split').splitSync;

let {isValidToken} = require('./tokenValidation.js');
let {login} = require('./login.js');

async function DownloadFile(call) {

    let validationResponseObject = await isValidToken();

    var validationResponse = validationResponseObject.isValid;

    console.log("validationResponse  download file-->",validationResponse);

    if (!validationResponse){
        await login();
        console.log("login function");
    }

    var filePath = process.env.LOCAL_PATH;
    var data = fs.readFileSync(filePath + call.request.filename);

    var buffArr = splitSync(data, {
        bytes: '20K' // 20 * 1024 bytes per files
    });

    try {
        buffArr.forEach(buffer => {
            call.write({ payload: buffer }); 
        });
        call.end();
    } catch (error) {
        call.write({ error: 'No such file or directory:  ' + error });
        console.error(error);
        call.end();
    }

}

exports.DownloadFile = DownloadFile;