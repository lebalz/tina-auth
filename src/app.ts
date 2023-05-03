import { strategyForEnvironment } from "./auth/index";
import express, { Request, Response, NextFunction } from "express";
import session from 'express-session';
import compression from "compression";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import http from 'http';
import { resolve } from "@tinacms/datalayer";
import database from "./services/database";

/**
 * Architecture samples
 * @link https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/5-AccessControl/1-call-api-roles/API/app.js
 * 
 */

const PORT = process.env.PORT || 3002;

const app = express();
const server = http.createServer(app);

app.use(compression(), express.json({ limit: "5mb" }));
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// ensure the server can call other domains: enable cross origin resource sharing (cors)
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || true, /* true = strict origin */
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

// received packages should be presented in the JSON format
app.use(express.json());

// show some helpful logs in the commandline
app.use(morgan("combined"));

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false /** TODO: check if false is ok */
});

app.use(sessionMiddleware)


app.use(passport.initialize());
app.use(passport.session());

passport.use(strategyForEnvironment());

app.get('/api/gql',
    passport.authenticate("oauth-bearer", { session: true }),
    async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { query, variables } = req.body;
        const config = {
            useRelativeMedia: true,
        } as any;

        const result = await resolve({
            config,
            database,
            query,
            variables,
            verbose: true,
        });

        return res.json(result);
    }
);

server.listen(PORT || 3002, () => {
    console.log(`application is running at: http://localhost:${PORT}`);
});
