const db = require('../config/database');

exports.getAllSpelers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';

        // Query aangepast naar tabel 'spelers' en juiste kolommen
        let query = `
            SELECT * FROM spelers
            WHERE (naam LIKE ? OR positie LIKE ?)
            ORDER BY rugnummer ASC
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
            message: 'Error fetching spelers',
            error: error.message
        });
    }
};

exports.getSpelerById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM spelers WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Speler niet gevonden' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching speler', error: error.message });
    }
};

exports.createSpeler = async (req, res) => {
    try {
        const { naam, positie, rugnummer } = req.body;

        // Basisvalidatie (Eis voor de opdracht!)
        if (!naam || !positie || !rugnummer) {
            return res.status(400).json({
                success: false,
                message: 'naam, positie en rugnummer zijn verplicht'
            });
        }

        const query = 'INSERT INTO spelers (naam, positie, rugnummer) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [naam, positie, rugnummer]);

        res.status(201).json({
            success: true,
            message: 'Speler succesvol aangemaakt',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fout bij aanmaken speler', error: error.message });
    }
};

exports.updateSpeler = async (req, res) => {
    try {
        const { id } = req.params;
        const { naam, positie, rugnummer } = req.body;

        const [existing] = await db.query('SELECT id FROM spelers WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Speler niet gevonden' });
        }

        const query = 'UPDATE spelers SET naam = ?, positie = ?, rugnummer = ? WHERE id = ?';
        await db.query(query, [naam, positie, rugnummer, id]);

        res.json({ success: true, message: 'Speler succesvol geüpdatet' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating speler', error: error.message });
    }
};

exports.deleteSpeler = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT id FROM spelers WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Speler niet gevonden' });
        }

        await db.query('DELETE FROM spelers WHERE id = ?', [id]);
        res.json({ success: true, message: 'Speler verwijderd' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fout bij verwijderen', error: error.message });
    }
};