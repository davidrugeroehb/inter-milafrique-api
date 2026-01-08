const db = require('../config/database');

exports.getAllSpelers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';
        const position = req.query.position || '';

        let query = `
            SELECT id, name, username, email, position, jersey_number, bio, birthday, profile_photo
            FROM users
            WHERE (name LIKE ? OR username LIKE ? OR position LIKE ?)
        `;

        let params = [`%${search}%`, `%${search}%`, `%${search}%`];

        if (position) {
            query += ` AND position = ?`;
            params.push(position);
        }

        query += ` ORDER BY jersey_number LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await db.query(query, params);

        res.json({
            success: true,
            data: rows,
            meta: {
                limit,
                offset,
                search,
                position
            }
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

        const query = `
            SELECT id, name, username, email, position, jersey_number, bio, birthday, profile_photo, created_at
            FROM users
            WHERE id = ?
        `;

        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Speler niet gevonden'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching speler',
            error: error.message
        });
    }
};

exports.createSpeler = async (req, res) => {
    try {
        const { name, email, username, position, jersey_number, bio } = req.body;


        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name en email zijn nodig'
            });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email bestaat al'
            });
        }

        const query = `
            INSERT INTO users (name, email, username, position, jersey_number, bio, password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, '$2y$12$defaultpasswordhash', NOW(), NOW())
        `;

        const [result] = await db.query(query, [name, email, username, position, jersey_number, bio]);

        res.status(201).json({
            success: true,
            message: 'Speler aangemaakt',
            data: {
                id: result.insertId,
                name,
                email,
                username,
                position,
                jersey_number
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'ERROR: speler niet aangemaakt',
            error: error.message
        });
    }
};

exports.updateSpeler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, position, jersey_number, bio } = req.body;

        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Speler niet gevonden'
            });
        }

        const query = `
            UPDATE users
            SET name = ?, username = ?, position = ?, jersey_number = ?, bio = ?, updated_at = NOW()
            WHERE id = ?
        `;

        await db.query(query, [name, username, position, jersey_number, bio, id]);

        res.json({
            success: true,
            message: 'Speler succesvol geüpdate',
            data: { id, name, username, position, jersey_number }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating speler',
            error: error.message
        });
    }
};

exports.deleteSpeler = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Speler niet gevonden'
            });
        }

        await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Speler verwijdert'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'ERROR: speler verwijderen',
            error: error.message
        });
    }
};