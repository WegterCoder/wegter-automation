module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const payload = (req.query || req.body );
    const responseMessage = {
        Message: "Wegter Automation function executed successfully.",
        Request: req
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}