import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app: express.Application = express();
app.set('port', (process.env.PORT || 5000)) // default port to listen

app.use(express.json());                // parse request body as JSON
app.use(express.static(__dirname));     // serve static html folders
app.use(express.static("public"));      // set public to be static folder
app.use(cors());                        // so that endpoint can be reached from browser

const apiLimiter: rateLimit.RateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 4,
    message: 'You have exceeded the api limit per minute'
});

app.use("/downloadmp3", apiLimiter);

// define a route handler for the default home page
app.get( "/_health", ( _req, res ) => {
    res.send("ok")
} );

app.get( "/downloadmp3", async ( req: express.Request, res: express.Response ) => {
    try {
        // do input validation on client side.
        const url = String(req.query.urlInput);
        const audioQuality = String(req.query.audioQuality);

        // tslint:disable-next-line:no-console
        console.log(`${url} and ${audioQuality}`);
        if (url == null || audioQuality == null || audioQuality !== "lowestaudio" && audioQuality !== "highestaudio"){
            return res.json({error: "url / audioQuality must be defined properly."});
        }

        let title: string = "audio";
        let lengthSeconds: number;
        let errorMessage;
        await ytdl.getBasicInfo(url, (error, info) => {
            if (error){
                errorMessage = "please check url";
            } else {
                title = info.player_response.videoDetails.title;
                lengthSeconds = info.player_response.videoDetails.lengthSeconds;

                // tslint:disable-next-line:no-console
                console.log(`title : ${title}`);
                if (lengthSeconds > 30*60){
                    errorMessage = `Length of ${lengthSeconds/60} minutes is too long. Please keep the videos below 30 mins`;
                }
            }

        });

        if (errorMessage){
            return res.json({error: errorMessage});
        }

        res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
		ytdl(url, {
            filter: 'audioonly',
            quality: audioQuality
		}).pipe(res);
    } catch (error) {
        res.json({error});
    }
} );

// start the express server
app.listen(app.get('port'), () => {
    // tslint:disable-next-line:no-console
    console.log("Node app is running at localhost:" + app.get('port'))
  })