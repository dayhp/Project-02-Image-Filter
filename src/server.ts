import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });

    // Handle method GET image for filteredimage?image_url={{URL}}
    app.get("/filteredimage", async (req: any, res: any) => {
        console.log("Start download file...");
        try {
            const pathImage: string = await filterImageFromURL(req.query.image_url);
            return res.status(200).sendFile(pathImage, function (errorMessage) {
                console.log("File downloaded successful...");
                // Perform file delete after successful downloaded
                if (!errorMessage) {
                    deleteLocalFiles([pathImage]);
                    console.log("File deleted successful...");
                }
            });
        } catch (e) {
            console.log("Processing handle file error... " + e);
        }
    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();