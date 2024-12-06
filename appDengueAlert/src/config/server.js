const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
// Para gerar identificadores únicos
const { v4: uuidv4 } = require('uuid'); 

// Inicializar Firebase Admin SDK
const serviceAccount = require('./firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'denguealert-29b4d.firebasestorage.app',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Configuração do Express
const app = express();
app.use(express.json());

// Configuração do Multer para receber arquivos de imagem
const upload = multer({
  storage: multer.memoryStorage(), // Armazena temporariamente a imagem na memória antes do upload
});

// Endpoint para upload da imagem
app.post('/upload', upload.single('photo'), async (req, res) => {
  const { description, userId } = req.body;

  if (!req.file || !description || !userId) {
    return res.status(400).json({ error: 'Imagem, descrição e ID de usuário são obrigatórios.' });
  }

  try {
    const filename = `denuncias/${userId}/${uuidv4()}.jpg`;
    const file = bucket.file(filename);

    // Faz o upload do arquivo para o Firebase Storage
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      public: true,
    });

    // Obtém a URL de download público
    const photoURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    // Salva os dados no Firestore
    const docRef = await db.collection('Reports').add({
      userId,
      photoURL,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      message: 'Upload realizado com sucesso!',
      reportId: docRef.id,
      photoURL,
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
