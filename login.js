const PROTO_PATH_GATEWAY = './proto/gateway-comm.proto';
var ip = require("ip");
var {redisClient} = require('./redisClient');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

let packageDefinition_gateway = protoLoader.loadSync(
    PROTO_PATH_GATEWAY,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
  });
let gateway_comm_proto = grpc.loadPackageDefinition(packageDefinition_gateway).stream;

async function login() {

    var gatewayClient = new gateway_comm_proto.Authenticate('localhost:8800',
                                         grpc.credentials.createInsecure());

    await new Promise((resolve,reject) => {
      gatewayClient.Login({ip: ip.address(), password : "cmpe275", type: "NODE"}, (error, response) => {
        if (error) {
          reject(error)
        }
        console.log("No error in login");
        console.log(response.masterip);
        console.log(response.message);
        console.log(response.token);
        redisClient.setEx("masterip", 3600, response.masterip);
        redisClient.setEx("token", 3600, response.token);
        resolve(response);
    });
    })
  
  }

  exports.login = login;