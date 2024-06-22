const pool = require('../config/db');

const getLomba = async (req, res) => {
    try {
        
        const [lomba] = await pool.query(`SELECT * FROM lomba`);
        
        const [mustDelete] = await pool.query(`
            SELECT * FROM lomba WHERE deadline < NOW() AND deadline IS NOT NULL        
        `)

        if (mustDelete.length > 0) {
            const [lomba] = await pool.query(`DELETE FROM lomba WHERE deadline < NOW() AND deadline IS NOT NULL`);
        }

        res.status(200).json(lomba);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getDetailLomba = async (req, res) => {
    const { lombaId } = req.params;
    try {
        const [lomba] = await pool.query(`SELECT * FROM lomba WHERE id = ?`, [lombaId]);

        const [diliat] = await pool.query(`UPDATE lomba SET diliat = diliat + 1 WHERE id = ?`, [lombaId]);


        res.status(200).json(lomba);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}   

const addDaftarLomba = async (req, res) => {
    const { lombaId } = req.params;

    try {
        const [daftar] = await pool.query(`
                UPDATE lomba
                SET daftar = daftar + 1
                WHERE id = ?  
            `, [lombaId]);
        
        if (daftar.affectedRows === 1) {
            res.status(200).json({ message: 'Daftar Lomba berhasil' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createLomba = async (req, res) => {
    const { nama, deadline, kategoriId, jenis, biaya, tingkat, linkPendaftaran, survey, deskripsi, narahubung, penyelengara } = req.body;
    const gambar = req.file ? req.file.filename : null;

    try {
        const [lomba] = await pool.query(`
            INSERT INTO lomba (nama, deadline, kategoriId, jenis, biaya, tingkat, linkPendaftaran, survey, deskripsi, narahubung, penyelengara, gambar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [nama, deadline, kategoriId, jenis, biaya, tingkat, linkPendaftaran, survey, deskripsi, narahubung, penyelengara, gambar]);

        if (lomba.affectedRows === 1) {
            res.status(201).json({ message: 'Lomba created successfully' });
        }

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getKategori = async (req, res) => {
    try {
        const [kategori] = await pool.query(`SELECT * FROM kategoriLomba`);
        res.status(200).json(kategori);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// const getLombaByNama = async (req, res) => {
//     const { nama } = req.params;
//     try {
//         // Gunakan prepared statement dengan placeholder untuk nama
//         const [lomba] = await pool.query(`SELECT * FROM lomba WHERE nama LIKE ?`, [`%${nama}%`]);
//         res.status(200).json(lomba);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




const getLombaFiltered = async (req, res) => {
    const { kategoriId, nama } = req.params;

    try {
        const [lomba] = await pool.query(`
            SELECT *
            FROM 
                lomba
            WHERE 
                kategoriId = ? AND nama LIKE ?`
                
            , [kategoriId, `%${nama}%`]);

        res.status(200).json(lomba);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
}



const getLombaFilter = async (req, res) => {
    const { jenisId } = req.params;
    const { nama } = req.body;

    // Validasi parameter
    if (!jenisId || !nama) {
        return res.status(400).json({ message: 'jenisId and name are required' });
    }
    

    try {
        const [kategori] = await pool.query(`SELECT * FROM kategoriLomba WHERE idJenis = ?`, [jenisId]);

        if (kategori.length === 0) {
            return res.status(404).json({ message: 'Kategori not found' });
        }

        const kategoriIds = kategori.map(k => k.id);

        const placeholders = kategoriIds.map(() => '?').join(',');

        // Query untuk mengambil data lomba berdasarkan kategoriId dan name
        const [lomba] = await pool.query(`
            SELECT *
            FROM lomba
            WHERE kategoriId IN (${placeholders}) AND nama LIKE ?`,
            [...kategoriIds, `%${nama}%`]
        );
        
        const result = {
            kategori: kategori,
            lomba
        }

        // Kirim data lomba sebagai response
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   
        



const getLombaByKategori = async (req, res) => {
    const { kategoriId } = req.params;
    try {
        const [lomba] = await pool.query(`SELECT * FROM lomba WHERE kategoriId = ?`, [kategoriId]);
        res.status(200).json(lomba);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getLomba, getDetailLomba, createLomba, getKategori, getLombaByKategori, getLombaFilter , getLombaFiltered , addDaftarLomba};