import express from "express";
import ytdl from "ytdl-core";

const app: express.Application = express();
const port: number = 8080; // default port to listen

app.use(express.json());    // <==== parse request body as JSON

// define a route handler for the default home page
app.get( "/_health", ( _req, res ) => {
    res.send("ok")
} );

app.post( "/downloadmp3", async ( req: express.Request, res: express.Response ) => {
    try {
        const url: string = req.body.url;
        let title = "audio";
        await ytdl.getBasicInfo(url, (_err, info) => {
            title = info.player_response.videoDetails.title;
        });

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio'
		}).pipe(res);
    } catch (error) {
        res.json({error});
    }
} );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );