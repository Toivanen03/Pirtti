import mongoose from 'mongoose'

const ContactsSchema = new mongoose.Schema({
    puhelin_1: String,
    puhelin_2: String,
    puhelin_3: String,
    sahkoposti: String,
}, { timestamps: true })

export default mongoose.model('Contacts', ContactsSchema)
