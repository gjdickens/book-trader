import path from 'path';
import express from 'express';
import webpack from 'webpack';
import middleware from './src/middleware';

import https from 'https';
import http from 'http';
import BodyParser from 'body-parser';
import Mongoose from 'mongoose';
import Passport from 'passport';
import PassportLocal from 'passport-local';
import Account from './src/models/account';
import Book from './src/models/book';

import socket from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socket(server);

if(process.env.NODE_ENV === 'development') {
	const config = require('./webpack.config.dev');
	const compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}));
	app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname, 'src')));
}

else if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'dist')));
}

var port = process.env.PORT || 3000;


//configure MongoDB
const db = process.env.MONGOLAB_URI;

Mongoose.connect(db);

const conn = Mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('database connected');
});

//initialize passport and body parser
const LocalStrategy = PassportLocal.Strategy;
app.use(Passport.initialize());
app.use(Passport.session());
app.use(BodyParser.urlencoded({ extended: true}));
app.use(BodyParser.json());


// passport config
Passport.use(new LocalStrategy(Account.authenticate()));
Passport.serializeUser(Account.serializeUser());
Passport.deserializeUser(Account.deserializeUser());



//API routes
app.post('/register', (req, res) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          console.log(err);
        }
        Passport.authenticate('local')(req, res, function () {
            res.json('register successful');
        });
    });
});

app.post('/login', Passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

//Sockets
io.on('connection', function(socket) {
		Book.find(function(err, books) {
			if (err) {res.send(err)};
			if (books.length > 0) {
				socket.emit('bookData', books);
			}
			else {
				socket.emit('bookData', []);
			}
		});

		socket.on('newBook', function (data) {
			var book = new Book();
			book.title = data.title;
			book.author = data.author;
			book.image_url = data.image_url;
			book.timestamp = new Date();

			book.save(function(err, book) {
				if (err) {console.log(err)};
				io.sockets.emit('newBookData', book);
			});

		});

		socket.on('editBook', function (data) {
			Book.findById(data._id, function(err, book) {
        if (err) {res.send(err)}
        else {
          book.title = data.title;
          book.author = data.author;
					book.image_url = data.image_url;
        	console.log(book);
          book.save(function(err, book) {
            if (err) {console.log(err)};
            io.sockets.emit('editBookData', book);
          });
        }

      });

		});

		socket.on('deleteBook', function (data) {
			Book.remove({
				_id: data._id
			}, function(err, book) {
				if (err) {res.send(err)};
				io.sockets.emit('deleteBookData', data);
		});

	});
});


app.get('*', middleware);

server.listen(port, '0.0.0.0', (err) => {
	if(err) {
		console.error(err);
	} else {
		console.info('Listening at ' + port);
	}
});
