const ftp = require('basic-ftp')
const fs = require('fs')


module.exports = async function (context, req) {
    let responseMessage;
    context.log('JavaScript HTTP trigger function processed a request.');

    //Download
    const ftpClient = new ftp.Client();
    ftpClient.ftp.verbose = true;

    try {
        await ftpClient.access(JSON.parse(process.env.MONTA_FTP))
        await ftpClient.ensureDir("/Rapportages")
        await ftpClient.downloadTo("Stock of all products.csv", "Stock of all products.csv")
        responseMessage = await ftpClient.list()
    }
    catch(err) {
        context.log(err)
    }
    ftpClient.close()

    //Read
    stream = fs.createReadStream("Stock of all products.csv");
    function streamToString (stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          stream.on('error', (err) => reject(err));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
    };

    //Return
    const fileBuffer = Buffer.from(await streamToString(stream));

    const ContentDisposition = req.query.fileName ? "attachment; filename=" + req.query.fileName : "inline";

    context.res = {
        status: 202,
        body: fileBuffer,
        headers : {"Content-Disposition" : ContentDisposition}
     };
}