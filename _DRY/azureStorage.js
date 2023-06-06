const {TableClient, TableServiceClient} = require("@azure/data-tables");
const {BlobClient, BlobServiceClient}   = require("@azure/storage-blob");


async function createItem (AzureWebJobsStorage, itemDetails){
    let functionResponse = {status:'sucess', value:null};
    try {
        switch(itemDetails.type) {
            case 'blob':
                const blobServiceClient = BlobServiceClient.fromConnectionString(AzureWebJobsStorage);
                const containerClient = blobServiceClient.getContainerClient(itemDetails.blob.containerName);
                const blockBlobClient = containerClient.getBlockBlobClient(itemDetails.blob.blobName);
                functionResponse =  await blockBlobClient.upload(itemDetails.blob.blobData, Buffer.byteLength(itemDetails.blob.blobData)); 
                break;
            
            case 'tableItem':
                const tableClient = TableClient.fromConnectionString(AzureWebJobsStorage,itemDetails.tableItem.tableName);
                const entity = itemDetails.tableItem.tableEntity
                functionResponse = await tableClient.createEntity(entity);
                break;
    
            case 'queue':
            // code block
            break;
      
            default:
              // code block
        }
     
    } catch (error) {
        functionResponse.status = 'fail';
        functionResponse.errorMessage = error.toString();
        functionResponse.errorStack = error.stack
        functionResponse.value = itemDetails;
    }
    return functionResponse
}

async function readItem (AzureWebJobsStorage, itemDetails){
    let functionResponse = {status:'sucess', value:null};
    try {
        switch (itemDetails.type) {
            case 'blob':
                const blobServiceClient = BlobServiceClient.fromConnectionString(AzureWebJobsStorage);
                const containerClient = blobServiceClient.getContainerClient(itemDetails.blob.containerName);
                const blobClient = containerClient.getBlobClient(itemDetails.blob.blobName);

                // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
                async function streamToBuffer(readableStream) {
                    return new Promise((resolve, reject) => {
                    const chunks = [];
                    readableStream.on("data", (data) => {
                        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
                    });
                    readableStream.on("end", () => {
                        resolve(Buffer.concat(chunks));
                    });
                    readableStream.on("error", reject);
                    });
                }

                // Get blob content from position 0 to the end
                // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
                const downloadBlockBlobResponse = await blobClient.download();
                functionResponse.value = (
                    await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
                ).toString();
                break;
        
            default:
                break;
        }
    } catch (error) {
        functionResponse.status = 'fail';
        functionResponse.errorMessage = error.toString();
        functionResponse.errorStack = error.stack
        functionResponse.value = itemDetails;        
    }
    return functionResponse
}

async function updateItem (AzureWebJobsStorage, itemDetails){
    let functionResponse = {status:'sucess', value:null};
    try {
        switch (itemDetails.type) {
            case 'blob':
                const blobServiceClient = BlobServiceClient.fromConnectionString(AzureWebJobsStorage);
                const containerClient = blobServiceClient.getContainerClient(itemDetails.blob.containerName);
                const blobClient = containerClient.getBlobClient(itemDetails.blob.blobName);            
                break;
        
            default:
                break;
        }
    } catch (error) {
        functionResponse.status = 'fail';
        functionResponse.errorMessage = error.toString();
        functionResponse.errorStack = error.stack
        functionResponse.value = itemDetails;                
    }
    return functionResponse
}

async function deleteItem (AzureWebJobsStorage, itemDetails){
    let functionResponse = {status:'sucess', value:null};
    try {
        switch (itemDetails.type) {
            case 'blob':
                const blobServiceClient = BlobServiceClient.fromConnectionString(AzureWebJobsStorage);
                const containerClient = blobServiceClient.getContainerClient(itemDetails.blob.containerName);
                const blobClient = containerClient.getBlobClient(itemDetails.blob.blobName);            
                break;
        
            default:
                break;
        }
    } catch (error) {
        functionResponse.status = 'fail';
        functionResponse.errorMessage = error.toString();
        functionResponse.errorStack = error.stack
        functionResponse.value = itemDetails;                
    }
    return functionResponse
}

module.exports = { BlobClient, BlobServiceClient, createItem, readItem, updateItem, deleteItem }