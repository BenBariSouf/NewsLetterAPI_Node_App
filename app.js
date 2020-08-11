// requiring our installed packages
const express = require('express');
const request = require('request');
const bodParser = require('body-parser');

const app = express();

app.use(bodParser.urlencoded({ extended: true })); //we need to add this in order to be able to use bodyParser which lets us capture data
// entered in forms

// sending static FileList(css, images...) using middleware
// by default, the server protects our static files from being accesed by the browser,to protect from unwanted changes
// if we want to allow acces to these files, we can use middleware like so:
app.use(express.static('./public')); //the static middleware tells the server to allow acces to all files included in the public folder

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
	//retrieving the entered data from our form
	var firstName = req.body.first_Name;
	var lastName = req.body.last_Name;
	var email = req.body.email;

	//the data that we register our new users with
	var data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					//merge_fields is a property that mailchimp uses with which we can send multiple user information
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	var jsonData = JSON.stringify(data); //turning our data into json format

	var options = {
		url: 'https://us17.api.mailchimp.com/3.0/lists/1c97263618', //API url
		method: 'POST', //the method
		headers: {
			// basic http authorisation for any API
			Authorization: 'Soufiane b947fb920934fc8bb82d7e4f28ca4dc1-us17',
		},
		body: jsonData,
	};

	request(options, function (error, response, body) {
		if (error) {
			res.sendFile(__dirname + '/error.html');
		} else {
			if (response.statusCode === 200) {
				res.sendFile(__dirname + '/succes.html');
				console.log('Success, status code ' + res.statusCode);
			} else {
				res.sendFile(__dirname + '/error.html');
			}
		}
	});
});

app.post('/failure', (req, res) => {
	res.redirect('/');
});

app.listen(3000, () => {
	console.log('Started listening on 3000');
});

// api key:b947fb920934fc8bb82d7e4f28ca4dc1-us17

// mail id:1c97263618
