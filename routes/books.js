import express from 'express';
const router = express.Router();
import multer from('multer');
import path from('path');
import fs from('fs');
import Book from '../models/book.model';
import Author from ('../models/author.model');
import Publisher from ('../models/publisher.model');


const uploadPath = path.join('client/public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('author', ['name']).populate('publisher', ['name']);
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/add', upload.single('coverImage'), (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    console.log(res.body);
    const newBook = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        price: req.body.price,
        coverImage: fileName,
        author: req.body.author,
        publisher: req.body.publisher,
        discount: req.body.discount
    });
    newBook.save()
        .then(() => res.json('Book added! || ' + newBook.id))
        .catch((err) => res.status(400).json('Error: ' + err));
});

router.get('/:id', (req, res) => {
    Book.findById(req.params.id)
        .then((book => res.json(book)))
        .catch((err) => res.status(400).json('Error: ' + err));
});

router.post('/update/:id', upload.single('coverImage'), (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    Book.findById(req.params.id)
        .then((book) => {
            let bookImageName = book.coverImage;
            if (bookImageName != null) {
                fs.unlinkSync(__dirname + `/../client/public/Images/bookCovers/${bookImageName}`, (err) => {
                    if (err) throw err;
                    console.log(`successfully deleted cover image`);
                });
            }
            book.title = req.body.title;
            book.description = req.body.description;
            book.publishDate = new Date(req.body.publishDate);
            book.pageCount = req.body.pageCount;
            book.coverImage = fileName;
            book.author = req.body.author;
            book.publisher = req.body.publisher;
            book.discount = req.body.discount;
            book.save()
                .then(() => res.json('Book updated! || ' + book.id))
                .catch((err) => res.status(400).json('Error: ' + err));
        });

});

router.delete('/:id', (req, res) => {
    Book.findById(req.params.id)
        .then(rbook => {
            let bookImageName = rbook.coverImage;
            if (bookImageName != null) {
                fs.unlinkSync(__dirname + `/../client/public/Images/bookCovers/${bookImageName}`, (err) => {
                    if (err) throw err;
                    console.log(`successfully deleted cover image`);
                });
            }
        })
        .catch((err) => console.log(err));
    Book.findByIdAndDelete(req.params.id)
        .then(() => res.json('Book deleted!'))
        .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;