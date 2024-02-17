const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
// conexion a la base de datos
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'OmicronPersei8*',
	database : 'construempleo'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/ ---> pagina inicio
app.get('/', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth --> pagina autenticacion
app.post('/auth', function(request, response) {
	// captura los campos de texto en donde se ingresan los datos
	let username = request.body.username;
	let password = request.body.password;
	// validar que los campos esten completos
	if (username && password) {
		// ejecutar consulta base de datos, 
		connection.query('SELECT * FROM candidato WHERE user_candidato = ? AND password_candidato = ?', [username, password], function(error, results, fields) {
			// Si hay algún problema con la consulta, mostrar el error
			if (error) throw error;
			// si la cuenta existe
			if (results.length > 0) {
				// autenticar el usuario
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Usuario incorrecto o contraseña incorrecta');
			}			
			response.end();
		});
	} else {
		response.send('Por favor ingrese usuario y contraseña');
		response.end();
	}
});

// http://localhost:3000/home --> pagina inicio
app.get('/home', function(request, response) {
	// si el usuario ingresa correctamente
	if (request.session.loggedin) {
		// mensaje de bienvenida
		response.send('Bienvenido, ' + request.session.username + '!');
	} else {
		
		response.send('Por favor, inicia sesión para ver esta página');
	}
	response.end();
});

app.listen(3000);



