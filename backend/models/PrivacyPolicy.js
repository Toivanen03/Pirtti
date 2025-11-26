import mongoose from 'mongoose'

const privacyPolicySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  pdf: { type: Buffer, required: true },
  contentType: { type: String, default: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model("PrivacyPolicy", privacyPolicySchema)