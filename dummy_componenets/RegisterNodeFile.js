function RegisterNodeFile(call, callback) {
    
    console.log("--->",call)
    callback(null, {
        masterip: "masterIP:4000",
        message: "SUCCESS",
        token: "1234",
      })
      
  
  
}

exports.RegisterNodeFile = RegisterNodeFile;