import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  admin: { type: Boolean, required: true, default: false },
  notifications: { type: Boolean, required: true, default: false },
  token: String,
}, { timestamps: true })

export default mongoose.model('User', userSchema)
