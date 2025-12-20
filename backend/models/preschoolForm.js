import mongoose from "mongoose"

const preSchoolSchema = new mongoose.Schema({
  formType: { type: String, required: true },
  etunimet_lapsi: { type: String, required: true },
  sukunimi_lapsi: { type: String, required: true },
  sotu: String,
  syntymaaika: String,
  ulkomainen_henkilotunnus: String,
  ulkomainen_ssn: { type: Boolean, required: true },
  kieli: { type: String, required: true },
  katuosoite: { type: String, required: true },
  postinumero: { type: String, required: true },
  lemmikit: String,
  etunimet_aikuinen_1: { type: String, required: true },
  sukunimi_aikuinen_1: { type: String, required: true },
  tyollisyys_aikuinen_1: { type: String, required: true },
  tyonantaja_tai_oppilaitos_aikuinen_1: String,
  puhelinnumero_aikuinen_1: { type: String, required: true },
  tyoaika_aikuinen_1: String,
  sahkoposti_aikuinen_1: { type: String, required: true },
  etunimet_aikuinen_2: String,
  sukunimi_aikuinen_2: String,
  tyollisyys_aikuinen_2: String,
  tyonantaja_tai_oppilaitos_aikuinen_2: String,
  puhelinnumero_aikuinen_2: String,
  tyoaika_aikuinen_2: String,
  sahkoposti_aikuinen_2: String,
  suhde: { type: String, required: true },
  asuminen: { type: String, required: true },
  paivahoito: { type: String, required: true },
  kuljetus: { type: String, required: true },
  muut_lapset: { type: String, required: true },
  suostumus: { type: Boolean, required: true },
  neuvola: String,
  allergiat: { type: Boolean, required: true },
  sairaalahoito: { type: Boolean, required: true },
  muut_terveystiedot: String,
  sairaala: String,
  lisatiedot: String,
  read: { type: Boolean, default: false, required: true },
  handler: { type: String, required: false }
}, { timestamps: true })

preSchoolSchema.index({ sukunimi_lapsi: 1, syntymaaika: 1 }, { background: true })

export default mongoose.model("PreSchoolForm", preSchoolSchema)