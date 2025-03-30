import Paste from "../models/paste.js";
import Note from "../models/note.js";
import hljs from 'highlight.js'
import { escape } from "html-escaper";

const getAllNotes = async(req, res, next) => {
    try {
        const noteItems = await Note.find({});
        if (!noteItems) return res.status(404).send();

        res.render('note/noteViewAll', { noteItems })
    } catch (e) {
        next(e);
    }
}

const getNote = async(req, res, next) => {
    if (!req.params.id) {
        res.status(400).send();
        return
    }

    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send();

        res.render('note/noteViewSingle', note)
    } catch (e) {
        next(e);
    }
}


const getCreateNewNote = (req, res, next) => {
    res.render('note/noteViewCreate')
}

// Uuden noten luominen, ottaa vastaan POST requestin
const postCreateNewNote = async(req, res, next) => {

    try {
        // Ottaa vastaan POST requestin bodyssä seuraavat tiedot:
        // title, content
        const { title, content } = req.body
        
        // Tarkistetaan ettei kumpikaan vaadituista tiedoista ole tyhjä,
        // jos on niin lähetetään error viesti middlewaren käsiteltäväksi
        if (!title || !content) return next('Molemmat kentät tulee täyttää')

        // Luodaan uusi Note instanssi Note modelin perusteella
        const note = new Note({
            // Poistetaan XSS haavoittuvuus
            title: escape(title),
            content: escape(content)
        });

        // Tallennetaan Note instanssin data tietokantaan
        const data = await note.save();
        
        // Jos tietokanta ei anna vastausta niin toiminto on epäonnistunut
        // ja lähetetään error status 500 - internal server error
        if (!data) {
            return next("Tapahtui virhe tietojen tallentamisessa.")
        }


        // Uusi data luotu onnistuneesti
        // Luodaan noteViewSingle html sivu ja palautetaan se selaimelle luodun note datan kanssa
        res.render('note/noteViewSingle', data)

    } catch (e) {
        // Jos ohjelma kaatuu niin lähetetään error middlewaren käsiteltäväksi
        next(e)
    }
}

const deleteNote = async(req, res, next) => {
    if (!req.params.id) return res.status(400).send();
    try {
        const note = await Note.findById(req.params.id);
        const removed_title = note.title

        if (!note) return res.status(404).send();
        await note.delete();

        next("Poisto onnistui. " + removed_title + " on poistettu.")

    } catch (e) {
        next(e);
    }
}

// Sama kuin GetNote mutta käytössä noteViewUpdate näkymässä
const getUpdateNote = async(req, res, next) => {
    if (!req.params.id) {
        res.status(400).send();
        return
    }

    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send();

        res.render('note/noteViewUpdate', note)
    } catch (e) {
        next(e);
    }
}

// Päivittää Noten.
const postUpdateNote = async(req, res, next) => {
    if (!req.params.id) return res.status(400).send();
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send();

        const { title, content } = req.body

        Note.findByIdAndUpdate(note.id, {title: title, content: content}, {new: true}, function (err, data) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated User : ", data);
            }
        });

        // Näytetään päivitetty Note
        const updatedNote = await Note.findById(req.params.id);
        res.render('note/noteViewSingle', updatedNote)

    } catch (e) {
        next(e);
    }
}

export default {
    getNote,
    getAllNotes,
    getCreateNewNote,
    postCreateNewNote,
    deleteNote,

    getUpdateNote,
    postUpdateNote
}