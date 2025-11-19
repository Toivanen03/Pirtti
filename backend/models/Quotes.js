import mongoose from 'mongoose'

const quoteItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  text: { type: String, required: true }
}, { _id: false })

const lohkoSchema = new mongoose.Schema({
  quotes_otsikko: { type: String },
  quotes: [quoteItemSchema]
}, { _id: false })

const quotesSchema = new mongoose.Schema({
  quotes_kuvaus: { type: String },
  quotes_lohkot: {
    lohko_1: lohkoSchema,
    lohko_2: lohkoSchema,
    lohko_3: lohkoSchema
  }
}, { capped: { size: 1048576, max: 100 } })

export default mongoose.model('Quotes', quotesSchema)