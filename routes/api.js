var express = require('express');
var router = express.Router();

const { upload } = require('../middleware/multer');

const authController = require('../controller/authController');
const lombaController = require('../controller/lombaController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.verifyToken ,authController.logout);

router.get('/lomba', lombaController.getLomba);
router.get('/lomba/:lombaId', authMiddleware.verifyToken ,lombaController.getDetailLomba);
router.post('/lomba', authMiddleware.verifyToken ,upload.single('gambar'),lombaController.createLomba);
router.get('/kategori', lombaController.getKategori);
router.get('/lomba/kategori/:kategoriId', lombaController.getLombaByKategori);
// router.get('/lomba/kategori/:kategoriId/nama/:nama', lombaController.getLombaFiltered);
router.get('/lomba/filter/:jenisId', lombaController.getLombaFilter);

router.patch('/lomba/:lombaId/daftar',  authMiddleware.verifyToken ,lombaController.addDaftarLomba);

module.exports = router;

