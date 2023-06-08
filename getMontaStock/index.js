const { LogStyle    } = require('../_DRY/misc')
const { readItem  } = require('../_DRY/azureStorage');

module.exports = async function (context, req) {
    /* Initialization */
    let httpResponse = {status: 401, body:"You are not authorized"};
    let exceptionRecords = [];
    
    if (context.bindingData.matchingCode == process.env.CE_SECRET){
        try {
            const item = await readItem(process.env.AzureWebJobsStorage,{
                type:'blob',
                blob:{
                    containerName: 'public',
                    blobName: 'ce/WegterMontaStock.csv'
                }
            });
            if (item.status === 'success'){
                const ContentDisposition = req.query.fileName ? "attachment; filename=" + req.query.fileName : "inline";
                httpResponse = {
                    status: 202,
                    body: item.value,
                    headers : {"Content-Disposition" : ContentDisposition, "Content-Type":"text/csv"}
                 };
            }
        
    
        } catch (error) {
            exceptionRecords.push({name:error.name,message:error.message,stack:error.stack});
            httpResponse = {
                status: 500, 
                body:`${error.message} \nLogged event: AF-${context.bindingData.sys.methodName} "${context.executionContext.invocationId}"`,
            }
            context.log(LogStyle.fg.red,error);
        }        
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