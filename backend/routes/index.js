import express from 'express';
import connection from './conf';

connection.connect((err) => {
  if (err) {
    console.log('Error : ', err);
  } else {
    console.log('Connecté');
  }
});

const router = express.Router();

export default router;

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// stratégie local passport
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    roleField: 'isAdmin',
    session: false
  },
  ((email, password, cb) => {
    connection.query('SELECT * FROM users WHERE email=?', email, (err, results) => {
      // si une erreur est obtenue
      if (err) return cb(err);
      // si les login/password ne sont pas bon
      const user = results[0];
      if (!user) return cb(null, false, { message: 'Incorrect email.' });
      // si l'utilisateur est ok on retourne l'objet user
      const authPassword = bcrypt.compareSync(password, user.password);

      if (!authPassword) return cb(null, false, { message: 'Incorrect password.' });
      return cb(null, user);
    });
  })
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'mayala'
},
  ((jwtPayload, cb) => cb(null, jwtPayload))
));


router.post('/api/signup', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const data = {
        email,
        password: hash,
        firstname,
        lastname
      };
      connection.query('INSERT INTO users SET ?', data, (err) => {
        if (err) {
          console.log('err :', err);
          res.status(500).json({ flash: err.message });
        } else {
          res.status(200).json({ flash: 'User has been signed up !' });
        }
      });
    });
  });
});

router.post('/api/signin', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).json({ message: info.message });
    const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'mayala');
    return res.json({ user, token });
  })(req, res);
});

router.get('/api/wines-list', (req, res) => {
  connection.query('SELECT wine.id,name_wine,name_castle,appellation,millesime_wine,colors,picture FROM wine INNER JOIN wine_color ON wine.color_id = wine_color.id', (err, results) => {
    if (err) {
      console.log('err :', err);
      res.sendStatus(500).send('Erreur au rendu des fiches vins');
    } else {
      res.send(results);
    }
  });
});

// To display the selected wine of the winecardlist in the special winecard page(M)
router.get('/api/wines-list/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`SELECT wine.id, name_wine,name_castle,appellation,millesime_wine,colors,picture FROM wine INNER JOIN wine_color ON wine.color_id = wine_color.id WHERE wine.id = ${id}`, (err, results) => {
    if (err) {
      res.sendStatus(410);
    } else {
      res.send(results);
    }
  });
});

// To retrieve the clicked wineCard to display it in the modification's formular
router.get('/api/winelist/modify/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`SELECT * FROM wine WHERE id = '${id}'`, (err, results) => {
    if (err) {
      res.sendStatus(409);
    } else {
      res.send(results);
    }
  });
});

// to search words included in wineCards and to display cards in the order of "weight- words"
router.get('/api/searchwine/:words', (req, res) => {
  const word = req.params.words.split(' ');
  const lengthWords = word.length;
  const requestSelectMatch = ['FROM (SELECT *'];
  const requestWhere = ['DESC) data WHERE'];
  let request = '';
  for (let i = 0; i < lengthWords; i += 1) {
    requestSelectMatch.push(`MATCH (name_wine,name_castle,desc_wine,txt_wine,appellation,region_wine,millesime_wine,couleur_wine) AGAINST ('${word[i]}') as score${i}`);
    requestWhere.push(`score${i} > 0`);
  }
  requestSelectMatch.join(', ').substring(-2);
  request = `SELECT *, score0 ${requestSelectMatch} FROM wine ORDER BY score0 ${requestWhere.join(' AND ').replace('AND ', '')}`;
  connection.query(request, word, (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur lors de la creation du compte');
    } else {
      res.send(results);
    }
  });
});

router.get('/api/searchwines/predict', (req, res) => {
  connection.query('SELECT DISTINCT name_wine FROM wine UNION SELECT DISTINCT name_castle FROM wine UNION SELECT DISTINCT region_wine FROM wine UNION SELECT DISTINCT couleur_wine FROM wine', (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

// to modify wineCards
router.put('/api/winelist/modify/processing/:id', (req, res) => {
  const formData = req.body;
  connection.query('UPDATE wine SET ? WHERE id= ?', [formData, req.params.id], (err, results) => {
    if (err) {
      res.sendStatus(409);
    } else {
      res.send(results);
    }
  });
});

router.post('/api/add-wine', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO wine SET ?', formData, (err) => {
    if (err) {
      res.sendStatus(409);
    } else {
      res.sendStatus(200);
    }
  });
});

router.get('/api/admin/my-account', (req, res) => {
  connection.query('SELECT id,firstname,lastname,email,isAdmin FROM users ORDER BY id DESC', (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur au rendu des utilisateurs');
    } else {
      res.send(results);
    }
  });
});

router.put('/api/admin/my-account/toggleadmin/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`UPDATE users SET isAdmin = !isAdmin WHERE id=${id}`, (err, results) => {
    if (err) {
      res.sendStatus(409).send('Erreur lors de la creation du compte');
    } else {
      res.send(results);
    }
  });
});

router.delete('/api/admin/my-account/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`DELETE FROM users WHERE id=${id}`, (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur lors de la suppression du compte');
    } else {
      res.send(results);
    }
  });
});

router.delete('/api/admin/delete-wine/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`DELETE FROM wine WHERE id=${id}`, (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur lors de la suppression du vin');
    } else {
      res.send(results);
    }
  });
});

router.get('/api/admin/comments', (req, res) => {
  connection.query('SELECT * FROM wine', (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur au rendu des utilisateurs');
    } else {
      res.send(results);
    }
  });
});

router.put('/api/admin/aroms/:id', (req, res) => {
  connection.query(`UPDATE wine SET ? WHERE id=${req.params.id}`, req.body, (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(409).send('Erreur au rendu des utilisateurs');
    } else {
      res.send(results);
    }
  });
});

// Get all aroma fr
router.get('/api/admin/aroma-fr', (req, res) => {
  connection.query('SELECT * FROM aroma_fr', (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur lors de la récupération des aromes');
    } else {
      res.send(results);
    }
  });
});

function retrievedatafr(req, res) {
  const spawn = require('child_process').spawn;

  const py = spawn('python3', ['/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/fr_tokenizetest.py',
    req.query.id, // request id
  ]);
  let output = '';
  py.stdout.on('data', (data) => {
    output += data;
  });
  py.stdout.on('close', () => {
    res.send();
  });
}

router.get('/api/admin/comments/analyzefr', retrievedatafr);

function retrievedataeng(req, res) {
  const spawn = require('child_process').spawn;

  const py = spawn('python3', ['/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/eng_tokenizetest.py',
    req.query.id, // request id
  ]);
  let output = '';
  py.stdout.on('data', (data) => {
    output += data;
  });
  py.stdout.on('close', () => {
    res.send();
  });
}

router.get('/api/admin/comments/analyzeeng', retrievedataeng);

function retrievearoms(req, res) {
  const spawn = require('child_process').spawn;

  const py = spawn('python3', ['/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/eng_findaroma.py',
    req.query.id, // request id
  ]);
  let output = '';
  py.stdout.on('data', (data) => {
    output += data;
  });
  py.stdout.on('end', () => {
    res.send(output);
  });
}

router.get('/api/admin/comments/aroms', retrievearoms);

router.put('/api/admin/comments-analyzed/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`UPDATE wine SET comment_wine_analyzed='', aroms_analyzed='' WHERE id=${id}`, (err, results) => {
    if (err) {
      res.sendStatus(409).send('Erreur lors de la suppression du commentaire');
    } else {
      res.send();
    }
  });
});

// Get all aroma eng
router.get('/api/admin/aroma-eng', (req, res) => {
  connection.query('SELECT * FROM aroma_eng', (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send('Error while recovering aromas');
    } else {
      res.send(results);
    }
  });
});

// Get list aroma fr
router.get('/api/admin/list-aroma-fr', (req, res) => {
  connection.query('SELECT DISTINCT category FROM aroma_fr', (err, results) => {
    if (err) {
      res.sendStatus(500).send('Erreur lors de la récupération des aromes');
    } else {
      res.send(results);
    }
  });
});

// Get list aroma eng
router.get('/api/admin/list-aroma-eng', (req, res) => {
  connection.query('SELECT DISTINCT category FROM aroma_eng', (err, results) => {
    if (err) {
      res.sendStatus(500).send('Error while recovering aromas');
    } else {
      res.send(results);
    }
  });
});

// Delete aroma in fr
router.delete('/api/admin/aroma-fr/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`DELETE FROM aroma_fr WHERE id=${id}`, (err) => {
    if (err) {
      res.sendStatus(500).send("Erreur lors de la suppression de l'arome");
    } else {
      res.sendStatus(202);
    }
  });
});

// Delete aroma in eng
router.delete('/api/admin/aroma-eng/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`DELETE FROM aroma_eng WHERE id=${id}`, (err) => {
    if (err) {
      res.sendStatus(500).send('Error while recovering aroma');
    } else {
      res.sendStatus(202);
    }
  });
});

// Update aroma in fr
router.put('/api/admin/aroma-fr/:id', (req, res) => {
  const formData = req.body;
  const id = req.params.id;
  connection.query(`UPDATE aroma_fr SET ? WHERE id=${id}`, formData, (err, results) => {
    if (err) {
      res.sendStatus(409).send("Erreur lors de la suppression de l'arome");
    } else {
      res.send(results);
    }
  });
});

// Update aroma in eng
router.put('/api/admin/aroma-eng/:id', (req, res) => {
  const formData = req.body;
  const id = req.params.id;
  connection.query(`UPDATE aroma_eng SET ? WHERE id=${id}`, formData, (err) => {
    if (err) {
      res.sendStatus(409).send('Error deleting the aroma');
    } else {
      res.sendStatus(201);
    }
  });
});

// Create aroma in fr
router.post('/api/admin/aroma-fr', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO aroma_fr SET ?', formData, (err) => {
    if (err) {
      res.sendStatus(409).send("Erreur lors de la creation de l'arome");
    } else {
      res.sendStatus(200);
    }
  });
});

// Create aroma in eng
router.post('/api/admin/aroma-eng', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO aroma_eng SET ?', formData, (err) => {
    if (err) {
      res.sendStatus(409).send('Error creating the aroma');
    } else {
      res.sendStatus(200);
    }
  });
});
// fetch aroms_english

function retrievearomseng(req, res) {
  const spawn = require('child_process').spawn;

  const py = spawn('python3', ['/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/eng_findaroma.py',
    req.query.id, // request id
  ]);
  let outpute = '';
  py.stdout.on('data', (data) => {
    outpute += data;
  });
  py.stdout.on('close', () => {
    res.send();
  });
}

router.get('/api/admin/comments/aromeng', retrievearomseng);

function retrievearomsfr(req, res) {
  const spawn = require('child_process').spawn;

  const py = spawn('python3', ['/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/fr_findaroma.py',
    req.query.id, // request id
  ]);
  let outpute = '';
  py.stdout.on('data', (data) => {
    outpute += data;
  });
  py.stdout.on('close', () => {
    res.send();
  });
}

router.get('/api/admin/comments/aromfr', retrievearomsfr);
