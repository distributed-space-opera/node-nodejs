const fs = require('fs');
const util = require('util')
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
const PROTO_PATH_Node = './proto/node-comm.proto';
const PROTO_PATH_MASTER = './proto/master-comm.proto';

let packageDefinition_node = protoLoader.loadSync(
    PROTO_PATH_Node,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
});

let node_comm_proto = grpc.loadPackageDefinition(packageDefinition_node).stream;


let packageDefinition1 = protoLoader.loadSync(
    PROTO_PATH_MASTER,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

let master_comm_proto = grpc.loadPackageDefinition(packageDefinition1).stream;

async function createReplicaOnIps(nodeips, filename, bufferedData) {
    return await new Promise((resolve, reject) => {
        let successips = [];

        nodeips.forEach(nodeip => {
        
        let client_node = new node_comm_proto.NodeReplication(nodeip,
            grpc.credentials.createInsecure());

        let call =  client_node.CreateReplica(function (error, response) {
            console.log("response from node aftere create replication -->",response.status);
        });

        call.write({filename: filename, payload: bufferedData});
        call.write({filename: filename, payload:''});
        call.end();
        });
        
        // resolve({successips: successips});
        resolve({successips: nodeIpsToReplicate});

    })
}

async function ReplicateFile(call, callback) {
    
    let nodeips = call.request.nodeips;

    var localPath = "/Users/rohitsikrewal/Documents/GRPC-JAVASCRIPT/";

    var file = localPath + call.request.filename;

    try {
        var bufferedData = fs.readFileSync(file);
    } catch (error) {
        console.error(error);
    }
    
    try {

        var filename =  call.request.filename;

        let successips = await createReplicaOnIps(nodeips, filename, bufferedData)
        .then((res) => {
            console.log("then--->", res)
            return res.successips})
        .catch((error) => console.log("error==>",error));

        let master_node_client = new master_comm_proto.Replication(masterip, grpc.credentials.createInsecure());


        let ReplicationDetailsRequest ={
            filename: filename,
            nodeips: successips
        }

        console.log("req body++++++", ReplicationDetailsRequest)

        let update_replication_call = master_node_client.UpdateReplicationStatus(ReplicationDetailsRequest, function (error, response) {
            console.log("res status======", response.status);
        });
        
        callback(null,{
            status: "SUCCESS"
        })

    } catch (error) {
        callback(null,{
            status: "FAILURE"
        })
    }
}

exports.ReplicateFile = ReplicateFile;