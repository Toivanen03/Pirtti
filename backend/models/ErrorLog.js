import mongoose from 'mongoose'

const errorSchema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: { type: String },
  resolver: { type: String },
  variables: { type: mongoose.Schema.Types.Mixed },
}, { capped: { size: 500000, max: 250 }, timestamps: true })

export default mongoose.model('ErrorLog', errorSchema)