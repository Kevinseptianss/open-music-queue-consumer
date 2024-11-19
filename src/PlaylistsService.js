const { Pool } = require('pg');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylists(playlistId) {
        let query = {
            text: `SELECT id, name FROM playlists WHERE id = $1`,
            values: [playlistId],
        }
        const resultPlaylist = await this._pool.query(query);

        query = {
            text: `SELECT s.id AS id, s.title AS title, s.performer AS performer FROM playlists p INNER JOIN playlist_songs ps on p.id = ps.playlist_id INNER JOIN songs s on ps.song_id = s.id WHERE p.id = $1;`,
            values: [playlistId],
        }
        const resultSongs = await this._pool.query(query);

        const result = {
            playlist: {
                id: playlistId,
                name: resultPlaylist.rows[0].name,
                songs: resultSongs.rows,
            }
        }

        return result;
    }
}

module.exports = PlaylistsService;