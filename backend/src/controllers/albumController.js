import {Album}  from "../models/albumSchema.js"

/* ----------------------- GET ALL ALBUMS ----------------------- */

export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find();
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};


/* ----------------------- GET ALBUMS BY ID ----------------------- */


export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		const album = await Album.findById(albumId).populate("songs");

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}
 
		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};

/* ----------------------- FILTER ALBUMS ----------------------- */

// route: /api/albums?genre=pop&language=english
export const getAlbumsByFilter = async (req, res) => {
	try {
		const { genre, language } = req.query;

		const filter = {};
		if (genre) filter.genre = genre;
		if (language) filter.language = language;

		const albums = await Album.find(filter).populate("songs");

		res.status(200).json(albums);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
