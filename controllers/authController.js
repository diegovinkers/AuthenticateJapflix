const mysql = require("mysql");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error)
        }
        if (results.length > 0 ) {
            return res.render('register', {
                message: 'Este mail ya esta en uso'
            })
        } else if (password!== passwordConfirm)
        {
            return res.render('register', {
                message: 'Password do not match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8); 
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                confirm.log(error);
            } else {
                console.log(results)
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });
 }

 exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect'
                    }); 
                } else {
                    const id = results[0].id;
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });

                    console.log("The token is: " + token);

                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }

                    res.cookie('jwt', token, cookieOptions);
                    res.status(200).redirect("/searcher"); // Redirige a la página principal después del inicio de sesión
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}


exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // Borra la cookie estableciendo la fecha de expiración a 1 ms en el pasado
    res.redirect('/');
  };
  