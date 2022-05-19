const fs = require('fs');
// const Blob = require('buffer')
const util = require('util')
function CreateReplica(call, callback) {
    
    console.log("In replicate server");
    const fileBytes = [];
    var dict = {};
    var fileName = "";
    call.on('data',function(byteStream){
        fileName = byteStream.filename;
        let bytesInput = Buffer.from(byteStream.payload);
       
        
            if(!(fileName in dict))
            {
                dict[fileName] = [bytesInput];
            }
            else
            {
                let val = dict[fileName];
                val.push(bytesInput);
            }
       
    });
    call.on('end',function(){
        // let fileName = "auth.properties5";
            console.log("Write into file");
            try{
                var newBuffer = Buffer.concat(dict[fileName]);
                fs.writeFile("/Users/rohitsikrewal/Documents/GRPC-JAVASCRIPT/"+fileName, newBuffer,function(err, result) {
                    if(err) console.log('error', err);
                  });
            }
            catch(err)
            {
                console.log(err);
            }
        callback(null,{
            status: "SUCCESS"
        })
    })
}

exports.CreateReplica = CreateReplica;