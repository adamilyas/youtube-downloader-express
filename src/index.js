"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var cors_1 = __importDefault(require("cors"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var app = express_1.default();
app.set('port', (process.env.PORT || 5000)); // default port to listen
app.use(express_1.default.json()); // parse request body as JSON
app.use(express_1.default.static(__dirname)); // serve static html folders
app.use(express_1.default.static("public")); // set public to be static folder
app.use(cors_1.default()); // so that endpoint can be reached from browser
var apiLimiter = express_rate_limit_1.default({
    windowMs: 60 * 1000,
    max: 4,
    message: 'You have exceeded the api limit per minute'
});
app.use("/downloadmp3", apiLimiter);
// define a route handler for the default home page
app.get("/_health", function (_req, res) {
    res.send("ok");
});
app.get("/downloadmp3", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, audioQuality, title_1, lengthSeconds_1, errorMessage_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                url = String(req.query.urlInput);
                audioQuality = String(req.query.audioQuality);
                // tslint:disable-next-line:no-console
                console.log(url + " and " + audioQuality);
                if (url == null || audioQuality == null || audioQuality !== "lowestaudio" && audioQuality !== "highestaudio") {
                    return [2 /*return*/, res.json({ error: "url / audioQuality must be defined properly." })];
                }
                title_1 = "audio";
                return [4 /*yield*/, ytdl_core_1.default.getBasicInfo(url, function (error, info) {
                        if (error) {
                            errorMessage_1 = "please check url";
                        }
                        else {
                            title_1 = info.player_response.videoDetails.title;
                            lengthSeconds_1 = info.player_response.videoDetails.lengthSeconds;
                            // tslint:disable-next-line:no-console
                            console.log("title : " + title_1);
                            if (lengthSeconds_1 > 30 * 60) {
                                errorMessage_1 = "Length of " + lengthSeconds_1 / 60 + " minutes is too long. Please keep the videos below 30 mins";
                            }
                        }
                    })];
            case 1:
                _a.sent();
                if (errorMessage_1) {
                    return [2 /*return*/, res.json({ error: errorMessage_1 })];
                }
                res.header('Content-Disposition', "attachment; filename=\"audio.mp3\"");
                ytdl_core_1.default(url, {
                    filter: 'audioonly',
                    quality: audioQuality
                }).pipe(res);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.json({ error: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// start the express server
app.listen(app.get('port'), function () {
    // tslint:disable-next-line:no-console
    console.log("Node app is running at localhost:" + app.get('port'));
});
