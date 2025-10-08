import pool from "../config/db.js";

export const getAllMovies = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM movies ORDER BY release_date DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const addMovie = async (req, res) => {
  const { title, description, languages, genre, release_date, poster_url } = req.body;

  if (!title || !genre || !release_date || !languages) {
    return res.status(400).json({ msg: 'Please provide title, genre, release date, and languages.' });
  }

  try {
  
    const languageArray = `{${languages}}`;

    const query = `
      INSERT INTO movies (title, description, languages, genre, release_date, poster_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [title, description, languageArray, genre, release_date, poster_url];
    const { rows } = await pool.query(query, values);

    res.status(201).json({ msg: 'Movie added successfully!', movie: rows[0] });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ msg: 'Server error while adding movie.' });
  }
};


export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM movies WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json({ msg: 'Movie and its associated data were deleted.' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};