const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, signDocument } = require('../controllers/documentController');

router.post('/upload', uploadDocument);
router.get('/repository', getDocuments);
router.post('/secure-sign', signDocument);

module.exports = router;