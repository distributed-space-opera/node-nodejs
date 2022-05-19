const PROTO_PATH_GATEWAY = './proto/gateway-comm.proto';

var ip = require("ip");
var {redisClient} = require('./redisClient');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

var packageDefinition_gateway = protoLoader.loadSync(
    PROTO_PATH_GATEWAY,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
  });
let gateway_comm_proto = grpc.loadPackageDefinition(packageDefinition_gateway).stream;


async function isValidToken() {

    var gatewayClient = new gateway_comm_proto.Authenticate('localhost:8800',
                                         grpc.credentials.createInsecure());

    let storedToken = await redisClient.get('token');

    if (!storedToken){
        return false;
    }
    
    validationReqParams = { client_ip: ip.address(),
                      token: storedToken
                    }
    // console.log("======", validationReqParams);
    
    let res = await new Promise((resolve,reject) => {
      gatewayClient.ValidateToken(validationReqParams, (error, response) => {
        if (!error){
          console.log("xxxxx", response.message);
          if (response.message == "VALID"){
            resolve({ isValid: true });
          }else{
            resolve({ isValid: false });
          }
        } else {
          reject(error);
        }
      });
    })
  return res;
}

exports.isValidToken = isValidToken;