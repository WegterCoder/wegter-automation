const { LogStyle    } = require('../_DRY/misc')
const { createItem  } = require('../_DRY/azureStorage');

module.exports = async function (context, req) {

    /* Initialization */
    let httpResponse = {status: 200, body:null};
    let exceptionRecords = [];

    try {
        if (context.bindingData.type == 'blob' && context.bindingData.headers['content-Type'] != "application/octet-stream") throw new Error('For blobs use header \"Content-Type: application/octet-stream\"');
        
        const bodyIsBinary = context.bindingData.headers['content-Type'] == "application/octet-stream"
        const createdItem = await createItem(process.env.AzureWebJobsStorage,{
            type:context.bindingData.type,
            blob:{
                containerName: context.bindingData.containerName,
                blobName: context.bindingData.blobName ? context.bindingData.blobName : req.query.blobName,
                blobData: req.body
            }
});
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