var express = require('express');
var router = express.Router();

const { upload } = require('../middleware/multer');

const authController = require('../controller/authController');
const lombaController = require('../controller/lombaController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/lomba', lombaController.getLomba);
router.get('/lomba/:lombaId', lombaController.getDetailLomba);
router.post('/lomba', upload.single('gambar'),lombaController.createLomba);
router.get('/kategori', lombaController.getKategori);
router.get('/lomba/kategori/:kategoriId', lombaController.getLombaByKategori);
router.get('/lomba/kategori/:kategoriId/nama/:nama', lombaController.getLombaFiltered);

router.patch('/lomba/:lombaId/daftar', lombaController.addDaftarLomba);

module.exports = router;

