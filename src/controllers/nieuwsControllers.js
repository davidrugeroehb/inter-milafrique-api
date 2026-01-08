const db = require('../config/database');


exports.getAllNieuws = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';

        let query = `
            SELECT n.*, u.name as author_name
            FROM nieuws n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.title LIKE ? OR n.content LIKE ?
            ORDER BY n.published_at DESC
            LIMIT ? OFFSET ?
        `;

        const searchTerm = `%${search}%`;
        const [rows] = await db.query(query, [searchTerm, searchTerm, limit, offset]);

        res.json({
            success: true,
            data: rows,
            meta: {
                limit,
                offset,
                search
            }
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

        const query = `
            SELECT n.*, u.name as author_name
            FROM nieuws n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.id = ?
        `;

        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nieuws artikel niet gevonden'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
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
        const { title, content, user_id } = req.body;


        if (!title || !content || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'Title, content and user_id is nodig'
            });
        }

        const query = `
            INSERT INTO nieuws (title, content, user_id, published_at, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW(), NOW())
        `;

        const [result] = await db.query(query, [title, content, user_id]);

        res.status(201).json({
            success: true,
            message: 'Nieuws succesvol bijgewerkt',
            data: {
                id: result.insertId,
                title,
                content,
                user_id
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
        const { title, content } = req.body;


        const [existing] = await db.query('SELECT * FROM nieuws WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nieuws not found'
            });
        }

        const query = `
            UPDATE nieuws
            SET title = ?, content = ?, updated_at = NOW()
            WHERE id = ?
        `;

        await db.query(query, [title, content, id]);

        res.json({
            success: true,
            message: 'Nieuws geüpdate',
            data: { id, title, content }
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
            return res.status(404).json({
                success: false,
                message: 'Nieuws niet gevonden'
            });
        }

        await db.query('DELETE FROM nieuws WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Nieuws verwijdert!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'ERROR: nieuws niet verwijdert',
            error: error.message
        });
    }
};