const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    // Contrôleur pour la création de livres
    const bookObject = JSON.parse(req.body.book); // Parse le corps de la requête en JSON
    delete bookObject._id; // Supprime l'_id du corps de la requête
    delete bookObject._userId; // Supprime le _userId du corps de la requête
    const book = new Book({ // Crée un nouveau livre avec les données de la requête
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        averageRating: 0, // Initialise la note moyenne du livre à 0
        ratings: [] // Initialise le tableau des notes avec un tableau vide
    });

    // Enregistre le livre dans la base de données
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; 
    delete bookObject._userId;
    if (!bookObject.title || !bookObject.author || !bookObject.year || !bookObject.genre) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }) // Trouve le livre avec l'_id fourni
        .then((book) => {
            if (book.userId != req.auth.userId) { // Si l'ID utilisateur du livre ne correspond pas à l'ID utilisateur de la requête
                res.status(401).json({ message: 'unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1]; // Récupère le nom du fichier de l'image du livre
                fs.unlink(`images/${filename}`, () => { // Supprime l'image
                    Book.deleteOne({ _id: req.params.id }) // Supprime le livre de la base de données
                        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};