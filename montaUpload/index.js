const { LogStyle        } = require('../_DRY/misc')
const { createItem      } = require('../_DRY/azureStorage');
const   ftp               = require('basic-ftp');
const { Stream          } = require('stream');
const   streamToBuffer    = require('stream-to-buffer');
// const { Cipher } = require('crypto');
// const { env } = require('process');


module.exports = async function (context, req) {

    /* Initialization */
    let httpResponse = {status: 200, body:null};
    let exceptionRecords = [];
    let fileStream = new Stream.Writable({
        write: function(chunk, encoding, next) {
        //   console.log(chunk.toString());
          next();
        }
    });
    let fileBuffer;

    /* Download */
    const ftpClient = new ftp.Client();
    ftpClient.ftp.verbose = true;
    try {
        await ftpClient.access({
            host: 'orders.montaportal.nl',
            port: '21',
            user: 'FTP_WEG',
            password: process.env.MONTA_SECRET,
            secure: true
        })
        await ftpClient.ensureDir("/Rapportages")
        await ftpClient.downloadTo(fileStream, "Stock of all products.csv")
        responseMessage = await ftpClient.list()
    }
    catch(err) {
        context.log(err)
        responseMessage = await ftpClient.list()
    }
    ftpClient.close()

    streamToBuffer(fileStream, function(err,buffer){
        if (err){
            context.log(err);
        }
        fileBuffer = buffer
    })

    try {
        // const bodyIsBinary = context.bindingData.headers['content-Type'] == "application/octet-stream"
        const createdItem = await createItem(process.env.AzureWebJobsStorage,{
            type:'blob',
            blob:{
                containerName: 'public',
                blobName: 'ce/WegterMontaStock.csv',
                blobData: 'fileStream'
            }    
        });
        context.log(JSON.stringify(createdItem));

    } catch (error) {
        exceptionRecords.push({name:error.name,message:error.message,stack:error.stack});
        httpResponse = {status: 500, body:`${error.message} \nLogged event: AF-${context.bindingData.sys.methodName} "${context.executionContext.invocationId}"`,
    }
        context.log(LogStyle.fg.red,error);
    }

    // http out binding
    context.res = httpResponse

    // table out binding
    context.bindings.event = {
        PartitionKey: `AF-${context.bindingData.sys.methodName}`,
        RowKey: JSON.stringify(context.executionContext.invocationId),
        JSON: JSON.stringify(context.bindingData),
        JSONExceptions: exceptionRecords
    }    

}