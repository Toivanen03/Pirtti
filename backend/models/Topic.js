import mongoose from 'mongoose'

const topicSchema = new mongoose.Schema({
  otsikko: { type: String, required: true, trim: true },
  ajankohta: { type: String, required: false },
  teksti: { type: String, required: true, trim: true },
  createdAt: {type: Date, default: Date.now }

}, { capped: { size: 100000, max: 250 }, timestamps: false })

export default mongoose.model('Topic', topicSchema)