const PROTO_PATH = '../proto/client-comm.proto';
const PROTO_PATH1 = '../proto/master-comm.proto';
const PROTO_PATH_Node = '../proto/node-comm.proto';

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

let packageDefinition1 = protoLoader.loadSync(
  PROTO_PATH1,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

let packageDefinition_node = protoLoader.loadSync(
  PROTO_PATH_Node,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

let client_comm_proto = grpc.loadPackageDefinition(packageDefinition).client;
let master_comm_proto = grpc.loadPackageDefinition(packageDefinition1).stream;
let node_comm_proto = grpc.loadPackageDefinition(packageDefinition_node).stream;

function main() {
  let client = new client_comm_proto.Streaming('localhost:6080',
                                        grpc.credentials.createInsecure());
  let client1 = new master_comm_proto.Replication('localhost:4502',
  grpc.credentials.createInsecure());    

  let client_node = new node_comm_proto.NodeReplication('localhost:6080',
                                        grpc.credentials.createInsecure());

  var buffer = new Buffer.alloc(1024);
  let filePath = "/Users/rohitsikrewal/Documents/GRPC-JAVASCRIPT/file_example_MP4_480_1_5MG.mp4";
  //let filePath = "C:/Users/alism/Desktop/Node/File/sample.pdf";

  try {
    let chunkSize = 100;
    const data = fs.readFileSync(filePath);
    let call = client.UploadFile(function (error, response) {
      console.log(response);
    });
   for(let i=0;(chunkSize*i)<data.length;i++)
   {
     if(((chunkSize*i)+chunkSize)<data.length)
      call.write({filename: "file_example_MP4_480_1_5MG.mp4", payload:data.slice((chunkSize*i), (chunkSize*i)+chunkSize)});
    else
      call.write({filename: "file_example_MP4_480_1_5MG.mp4", payload:data.slice((chunkSize*i), data.length)});
   }
      
      call.write({filename: "file_example_MP4_480_1_5MG.mp4", payload:''});
      call.end();

  } catch (err) {
    console.error(err);
  }

  // try {
  //   const data = fs.readFileSync(filePath);
  //   let call = client_node.CreateReplica(function (error, response) {
  //     console.log(response);
  //   });
  //   call.write({filename: "testing", payload:data});
  //   call.write({filename: "testing", payload:''});
  //   call.end();
  // } catch (err) {
  //   console.error(err);
  // }

  // try {
  //   let call = client_node.ReplicateFile({filename: "sample", nodeips:''},function (error, response) {
  //     console.log("Response is "+JSON.stringify(response.status));
  //     console.log("Error is "+error);
  //   });
  //   call.on('data',function(error, response){
  //   });
  // } catch (err) {
  //   console.error(err);
  // }

}

main();