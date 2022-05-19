const PROTO_PATH = './proto/client-comm.proto';
const PROTO_PATH_Node = './proto/node-comm.proto';
const PROTO_PATH_GATEWAY = './proto/gateway-comm.proto';

var ip = require("ip");
var {redisClient} = require('./redisClient');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


let packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
let client_comm_proto = grpc.loadPackageDefinition(packageDefinition)

let packageDefinition_node = protoLoader.loadSync(
  PROTO_PATH_Node,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
let node_comm_proto = grpc.loadPackageDefinition(packageDefinition_node);

let packageDefinition_gateway = protoLoader.loadSync(
  PROTO_PATH_GATEWAY,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
let gateway_comm_proto = grpc.loadPackageDefinition(packageDefinition_gateway).stream;

let { UploadFile } = require('./UploadFile.js');
let { CreateReplica } = require('./CreateReplica.js');
let { ReplicateFile } = require('./ReplicateFile.js');
let { DownloadFile } = require('./DownloadFile.js');

async function main() {
  let server = new grpc.Server();
 
  server.addService(node_comm_proto.stream.NodeReplication.service, 
    {CreateReplica: CreateReplica }
  );
  
  server.bind('0.0.0.0:8000', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();