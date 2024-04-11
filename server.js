// Inicialización Firebase
const admin = require('firebase-admin');
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.F_PROJECT_ID,
  "private_key_id": process.env.F_PRIVATE_KEY_ID,
  "private_key": process.env.F_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.F_CLIENT_EMAIL,
  "client_id": process.env.F_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.F_CLIENT_X509_CERT_URL,
  "universe_domain": "googleapis.com"
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.F_DATABASE_URL
});
const db = admin.database();
const ref = db.ref('recetas');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;
app.use(express.json());

// Ruta para obtener todas las recetas
app.get('/recetas', (req, res) => {
  ref.once('value', (snapshot) => {
    res.json(snapshot.val());
  });
});

// Ruta para obtener una receta por su ID
app.get('/recetas/:id', (req, res) => {
  const id = req.params.id;
  ref.child(id).once('value', (snapshot) => {
    res.json(snapshot.val());
  });
});

// Ruta para crear una nueva receta
app.post('/recetas', (req, res) => {
  const newReceta = req.body;
  const id = newReceta.caso.toString();
  ref.child(id).set(newReceta)
    .then(() => {
      res.status(201).send('Receta creada correctamente');
    })
    .catch((error) => {
      res.status(500).send('Error al crear la receta: ' + error);
    });
});

// Ruta para actualizar una receta existente
app.put('/recetas/:id', (req, res) => {
  const id = req.params.id;
  const updatedReceta = req.body;
  ref.child(id).update(updatedReceta)
    .then(() => {
      res.send('Receta actualizada correctamente');
    })
    .catch((error) => {
      res.status(500).send('Error al actualizar la receta: ' + error);
    });
});

// Ruta para eliminar una receta
app.delete('/recetas/:id', (req, res) => {
  const id = req.params.id;
  ref.child(id).remove()
    .then(() => {
      res.send('Receta eliminada correctamente');
    })
    .catch((error) => {
      res.status(500).send('Error al eliminar la receta: ' + error);
    });
});

// iniciar servidor HTTP
app.listen(port, () => {
  console.log(`API recetas corriendo`);
});

