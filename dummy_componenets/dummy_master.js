const PROTO_PATH = '../proto/master-comm.proto';
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
let master_comm_proto = grpc.loadPackageDefinition(packageDefinition)

let { GetNodeIpsForReplication } = require('./Dummy_GetNodeIpsForReplication.js');

function main() {
  let server = new grpc.Server();
  server.addService(master_comm_proto.stream.Replication.service, 
    {GetNodeIpsForReplication: GetNodeIpsForReplication,
      UpdateReplicationStatus: (call, callback) => {
        callback(null, {status: "SUCCESS"})
      } }
  );
  server.bind('0.0.0.0:4502', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();