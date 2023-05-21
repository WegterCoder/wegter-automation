module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const payload = (req.query || req.body );
    const responseMessage = payload == {}
        ? payload
        : "Wegter Automation function executed successfully.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}