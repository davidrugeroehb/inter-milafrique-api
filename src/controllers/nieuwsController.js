const db = require('../config/database');

exports.getAllNieuws = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';

        // Aangepast: Geen JOIN met users (want die tabel is er niet)
        let query = `
            SELECT * FROM nieuws
            WHERE titel LIKE ? OR inhoud LIKE ?
            ORDER BY datum DESC
            LIMIT ? OFFSET ?
        `;

        const searchTerm = `%${search}%`;
        const [rows] = await db.query(query, [searchTerm, searchTerm, limit, offset]);

        res.json({
            success: true,
            data: rows,
            meta: { limit, offset, search }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching nieuws',
            error: error.message
        });
    }
};

exports.getNieuwsById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM nieuws WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nieuws artikel niet gevonden'
            });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching nieuws',
            error: error.message
        });
    }
};

exports.createNieuws = async (req, res) => {
    try {
        const { titel, inhoud } = req.body;

        if (!titel || !inhoud) {
            return res.status(400).json({
                success: false,
                message: 'titel en inhoud zijn verplicht'
            });
        }

        // FIX: Kolommen en waarden komen nu overeen
        const query = 'INSERT INTO nieuws (titel, inhoud, datum) VALUES (?, ?, NOW())';
        const [result] = await db.query(query, [titel, inhoud]);

        res.status(201).json({
            success: true,
            message: 'Nieuws succesvol aangemaakt',
            data: {
                id: result.insertId,
                titel,
                inhoud
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating nieuws',
            error: error.message
        });
    }
};

exports.updateNieuws = async (req, res) => {
    try {
        const { id } = req.params;
        const { titel, inhoud } = req.body;

        const [existing] = await db.query('SELECT * FROM nieuws WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Nieuws niet gevonden' });
        }

        // Aangepast: updated_at weggehaald want die kolom is er niet in TablePlus
        const query = 'UPDATE nieuws SET titel = ?, inhoud = ? WHERE id = ?';
        await db.query(query, [titel, inhoud, id]);

        res.json({
            success: true,
            message: 'Nieuws geüpdate',
            data: { id, titel, inhoud }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error met nieuws-update',
            error: error.message
        });
    }
};

exports.deleteNieuws = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM nieuws WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Nieuws niet gevonden' });
        }

        await db.query('DELETE FROM nieuws WHERE id = ?', [id]);
        res.json({ success: true, message: 'Nieuws verwijderd!' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'ERROR: nieuws niet verwijderd',
            error: error.message
        });
    }
};