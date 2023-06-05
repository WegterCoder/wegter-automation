module.exports = async function (context, req) {

    let responseMessage = {status: 200, body:null};
    let exceptionRecords = [];
    /* Exceptions handling */
    try {

        if (req.query.test == 'exception') {req.nonExistingFunction()}
        

        context.bindings.events = [];
        const payload = (req.query || req.body );
        responseMessage.body = {
            TimeStamp: new Date().toISOString(),
            Message: "Wegter Automation function executed successfully.",
            BindingData: context.bindingData
        }
    } catch (error) {
        exceptionRecords.push({name:error.name,message:error.message,stack:error.stack});
        responseMessage = {status: 500, body:`Logged event: AF-${context.bindingData.sys.methodName} "${context.executionContext.invocationId}"`}
    }

    // http out binding
    context.res = responseMessage;

    // table out binding
    context.bindings.event = {
        PartitionKey: `AF-${context.bindingData.sys.methodName}`,
        RowKey: JSON.stringify(context.executionContext.invocationId),
        JSON: JSON.stringify(context.bindingData),
        JSONExceptions: exceptionRecords
    }
}