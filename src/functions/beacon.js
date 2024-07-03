const { app } = require('@azure/functions');

app.http('beacon', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        let responseMessage = {status: 200, body:null};
        let exceptionRecords = [];

        try {

            if ((request.params.test == 'exception') || (request.query.test == 'exception')) {request.nonExistingFunction()}
    
            // context.bindings.events = [];
            const payload = (request.query || request.body );
            responseMessage.body = JSON.stringify({
                TimeStamp: new Date().toISOString(),
                Request: request,
                Message: "Wegter Automation function executed successfully!",
                BindingData: await context
            })
        } catch (error) {
            exceptionRecords.push({name:error.name,message:error.message,stack:error.stack});
            context.log('Beacon catched an Exception');
            context.log(error);
            responseMessage = {status: 500, body:`Logged event: AF-${context.bindingData.sys.methodName} "${context.executionContext.invocationId}"`}
        }

        // http out binding
        return responseMessage;

        // context.log(`Http function processed request for url "${request.url}"`);

        // const name = request.query.get('name') || await request.text() || 'world';

        // return { body: `Hello, ${name}!` };
    }
});


 
// module.exports = async function (context, req) {

//     let responseMessage = {status: 200, body:null};
//     let exceptionRecords = [];
//     /* Exceptions handling */
//     try {

//         if (req.query.test == 'exception') {req.nonExistingFunction()}
        

//         context.bindings.events = [];
//         const payload = (req.query || req.body );
//         responseMessage.body = {
//             TimeStamp: new Date().toISOString(),
//             Message: "Wegter Automation function executed successfully.",
//             BindingData: context.bindingData
//         }
//     } catch (error) {
//         exceptionRecords.push({name:error.name,message:error.message,stack:error.stack});
//         context.log('Beacon catched an Exception');
//         context.log.error(error);
//         responseMessage = {status: 500, body:`Logged event: AF-${context.bindingData.sys.methodName} "${context.executionContext.invocationId}"`}
//     }

//     // http out binding
//     context.res = responseMessage;

//     // table out binding
//     context.bindings.event = {
//         PartitionKey: `AF-${context.bindingData.sys.methodName}`,
//         RowKey: JSON.stringify(context.executionContext.invocationId),
//         JSON: JSON.stringify(context.bindingData),
//         JSONExceptions: exceptionRecords
//     }
// }