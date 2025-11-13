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


export const getRunningMovies = async (req, res) => {
  try {
    console.log('Fetching running movies...');
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (m.id) m.* FROM movies m
       JOIN shows s ON s.movie_id = m.id
       WHERE s.show_time >= NOW()
       ORDER BY m.id, m.title`);

    console.log('Running movies found:', rows.length);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching running movies:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
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


export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, languages, genre, release_date, poster_url } = req.body;

  if (!title || !genre || !release_date || !languages) {
    return res.status(400).json({ msg: 'Please provide title, genre, release date, and languages.' });
  }

  try {
    const languageArray = `{${languages}}`;

    const query = `
      UPDATE movies 
      SET title = $1, description = $2, languages = $3, genre = $4, release_date = $5, poster_url = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [title, description, languageArray, genre, release_date, poster_url, id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    res.status(200).json({ msg: 'Movie updated successfully!', movie: rows[0] });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ msg: 'Server error while updating movie.' });
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