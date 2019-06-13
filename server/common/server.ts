import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';

import installValidator from './openapi';

import l from './logger';

const app = express();

export default class ExpressServer {
	constructor() {
		const root = path.normalize( __dirname + '/../..' );
		const apiExplorerPath = path.join( __dirname, '/../../public/api-explorer' );
		app.set( 'appPath', root + 'client' );
		app.use( bodyParser.json( { limit: process.env.REQUEST_LIMIT || '100kb' } ) );
		app.use( bodyParser.urlencoded( { extended: true, limit: process.env.REQUEST_LIMIT || '100kb' } ) );
		app.use( cookieParser( process.env.SESSION_SECRET ) );
		// app.use( express.static( `${root}/public` ) );

		app.use( process.env.API_EXPLORER || '/docs', express.static( apiExplorerPath ) );
	}

	router( routes: ( app: Application ) => void ): ExpressServer {
		installValidator( app, routes )
		return this;
	}

	listen( p: string | number = process.env.PORT ): Application {
		const welcome = port => () => l.info( `up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}` );
		http.createServer( app ).listen( p, welcome( p ) );
		return app;
	}
}
