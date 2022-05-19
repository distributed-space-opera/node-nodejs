require('dotenv').config();
const PROTO_PATH = '../proto/client-comm.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
const fs = require('fs');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
// let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;
let client_comm_proto = grpc.loadPackageDefinition(packageDefinition).stream;

function main() {
  let client = new client_comm_proto.Streaming(process.env.CLIENT_IP,
                                        grpc.credentials.createInsecure());
    
    let call = client.DownloadFile({filename: "sample.pdf"});

    
    call.on('data',function(response){
      
    let bufferResponse = response.payload;
    let errorResponse = response.error;

    if (errorResponse) {
      console.log(errorResponse);
    } else {
      console.log(bufferResponse);
      // fs.writeFile("/Users/rohitsikrewal/Documents/GRPC-JAVASCRIPT/sample65.pdf", bufferResponse,function(err, result) {
      //   if(err) console.log('error', err);
      // });
    }

    });

    call.on('end',function(){
    console.log('End Of Operation');
    });
  
}

main();