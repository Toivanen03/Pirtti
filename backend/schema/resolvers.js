import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import crypto from 'crypto'
import User from '../models/User.js'
import Topic from '../models/Topic.js'
import Quotes from '../models/Quotes.js'
import { createUserSchema } from './userValidation.js'
import { createContactsSchema } from './contactsValidation.js'
import ICPlan from '../models/ICPlan.js'
import PrivacyPolicy from '../models/PrivacyPolicy.js'
import Bylaws from '../models/Bylaws.js'
import { createDayCareFormSchema, createPreSchoolFormSchema } from './formValidation.js'
import Contacts from '../models/Contacts.js'
import { handleErrors } from './errorHandler.js'
import PreSchoolForm from '../models/preschoolForm.js'
import DayCareForm from '../models/daycareForm.js'
import GraphQLJSON from 'graphql-type-json'
import MailSender from '../utils/mailer.js'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import { GraphQLError } from 'graphql'
import { Buffer } from 'buffer'

const ALGORITHM = 'aes-256-gcm'

function encryptField(text) {
    if (!text) return text
    const iv = crypto.randomBytes(12)
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex')
    return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

function decryptField(encryptedText) {
    if (!encryptedText) return encryptedText
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    const [ivHex, authTagHex, data] = encryptedText.split(':')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
    let decrypted = decipher.update(data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

const requireAdmin = (user) => {
  if (!user) {
    throw new GraphQLError("Kirjaudu sisään", {
      extensions: { code: "UNAUTHENTICATED" }
    })
  }

  if (!user.admin) {
    throw new GraphQLError("Ei valtuuksia", {
      extensions: { code: "FORBIDDEN" }
    })
  }
}

function formatNames(input) {
    function capitalizeCompoundWords(str) {
        return str.toLowerCase()
            .replace(/(?:^|[\s-])\S/g, c => c.toUpperCase())
    }
    
    const output = { ...input }
    for (const key in output) {
        if (
            (key.toLowerCase().includes("nimi") ||
             key.toLowerCase().includes("nimet") ||
             key.toLowerCase().includes("katu")) &&
            typeof output[key] === "string"
        ) {
            output[key] = capitalizeCompoundWords(output[key].trim())
        }
    }
    return output
}

const resolvers = {
    JSON: GraphQLJSON,
    Upload: GraphQLUpload,

    Query: {
        users: handleErrors(async (_args, _root, context) => {
            requireAdmin(context.currentUser)

            const users = await User.find()
            return users.map(u => ({
                ...u.toObject(),
                id: u._id.toString()
            }))
        }),

        getForm: handleErrors(async (_, { id, formType }, context) => {
            requireAdmin(context.currentUser)

            const form = formType === 'vkh'
                ? await DayCareForm.findById(id)
                : formType === 'ekh'
                ? await PreSchoolForm.findById(id)
                : null

            if (!form) {
                throw new GraphQLError('Lomaketta ei löytynyt')
            }

            const sensitiveKeys = Object.keys(form._doc).filter(
                key => !['sukunimi_lapsi', 'syntymaaika', 'suostumus', 'allergiat', 'sairaalahoito', 'ulkomainen_ssn', '_id', '__v', 'formType', 'read'].includes(key)
            )

            const decryptedForm = { ...form._doc }

            for (const key of sensitiveKeys) {
                if (typeof decryptedForm[key] === 'string' && decryptedForm[key].includes(':')) {
                    decryptedForm[key] = decryptField(decryptedForm[key])
                }
            }

            return {
                id: form._id,
                formType,
                read: form.read,
                sukunimi_lapsi: form.sukunimi_lapsi,
                syntymaaika: form.syntymaaika,
                ...decryptedForm
            }
        }),

        getForms: handleErrors(async (_, args, context) => {
            requireAdmin(context.currentUser)

            const { formType, limit = 10, skip = 0, search, read } = args

            const hasSearch =
                search &&
                Object.values(search).some(v => v !== undefined && v !== null && v !== "")

            const buildQuery = (search, readFilter) => {
                const q = {}

                if (readFilter !== undefined && readFilter !== null) {
                    q.read = readFilter === true
                }

                if (!search) return q

                if (search.id) {
                    if (mongoose.Types.ObjectId.isValid(search.id)) {
                        q._id = search.id
                    } else {
                        q.$expr = { $regexMatch: { input: { $toString: "$_id" }, regex: search.id, options: "i" } }
                    }
                }

                if (search.syntymaaika) {
                    const [d, m, y] = search.syntymaaika.trim().split('.')
                    const isoDate = `${y}-${m}-${d}`

                    q.syntymaaika = {
                        $gte: new Date(isoDate),
                        $lte: new Date(isoDate + "T23:59:59.999Z")
                    }
                }

                if (search.handler) q.handler = new RegExp(search.handler, "i")
                if (search.sukunimi) q.sukunimi_lapsi = new RegExp(search.sukunimi, "i")
                if (search.syntymaaika) q.syntymaaika = new RegExp(search.syntymaaika, "i")

                return q
            }

            const unreadVkhCount = await DayCareForm.countDocuments({ read: false })
            const unreadEkhCount = await PreSchoolForm.countDocuments({ read: false })

            const queryForCount = buildQuery(search, read)
            const totalVkhCount = (!formType || formType === "vkh") 
                ? await DayCareForm.countDocuments(queryForCount)
                : 0
            const totalEkhCount = (!formType || formType === "ekh")
                ? await PreSchoolForm.countDocuments(queryForCount)
                : 0

            const mapForms = (forms, type) =>
                forms.map(f => ({
                    id: f._id,
                    formType: type,
                    read: f.read,
                    sukunimi_lapsi: f.sukunimi_lapsi,
                    syntymaaika: f.syntymaaika,
                    createdAt: f.createdAt,
                    updatedAt: f.updatedAt,
                    handler: f.handler || null
                }))

            const queryForFetch = buildQuery(search, read)

            const fetchVkh = !formType || formType === "vkh"
                ? await DayCareForm.find(queryForFetch)
                    .sort({ createdAt: -1 })
                    .skip(hasSearch ? 0 : skip)
                    .limit(hasSearch ? 0 : limit)
                : []

            const fetchEkh = !formType || formType === "ekh"
                ? await PreSchoolForm.find(queryForFetch)
                    .sort({ createdAt: -1 })
                    .skip(hasSearch ? 0 : skip)
                    .limit(hasSearch ? 0 : limit)
                : []

            return {
                vkh: {
                    forms: mapForms(fetchVkh, "vkh"),
                    unreadCount: unreadVkhCount,
                    totalCount: totalVkhCount
                },
                ekh: {
                    forms: mapForms(fetchEkh, "ekh"),
                    unreadCount: unreadEkhCount,
                    totalCount: totalEkhCount
                }
            }
        }),

        getContacts: handleErrors(async () => {
            const contacts = await Contacts.findOne()
            return contacts
        }),

        getTopics: handleErrors(async () => {
            return await Topic.find().sort({ createdAt: -1 })
        }),

        quotes: handleErrors(async () => {
            let data = await Quotes.findOne()
            if (!data) {
                data = await Quotes.create({
                quotes_kuvaus: '',
                quotes_lohkot: {
                    lohko_1: { quotes_otsikko: '', quotes: [] },
                    lohko_2: { quotes_otsikko: '', quotes: [] },
                    lohko_3: { quotes_otsikko: '', quotes: [] }
                }
                })
            }
            return data
        }),

        internalControlDocument: handleErrors(async () => {
            const doc = await ICPlan.findOne()
            if (!doc) return null

            const file = {
                pdf: doc.pdf.toString('base64'),
                filename: doc.filename
            }

            return file
        }),

        privacyPolicyDocument: handleErrors(async () => {
            const doc = await PrivacyPolicy.findOne()
            if (!doc) return null

            const file = {
                pdf: doc.pdf.toString('base64'),
                filename: doc.filename
            }

            return file
        }),

        bylawsDocument: handleErrors(async () => {
            const doc = await Bylaws.findOne()
            if (!doc) return null

            const file = {
                pdf: doc.pdf.toString('base64'),
                filename: doc.filename
            }

            return file
        })
    },

    Mutation: {
        createUser: handleErrors(async (_root, { email, password, admin, notifications }, context) => {
            requireAdmin(context.currentUser)

            createUserSchema.parse({ email, password, admin, notifications })

            const passwordHash = await bcrypt.hash(password, 10)
            const user = await new User({
                email: email.toLowerCase().trim(),
                passwordHash,
                admin: true,
                notifications: false
            }).save()

            return {
            ...user.toObject(),
                id: user._id.toString(),
                token: jwt.sign(
                    { email: user.email, id: user._id, admin: user.admin },
                    process.env.JWT_SECRET
                ),
            }
        }),

        deleteUser: handleErrors(async (_root, { id }, context) => {
            requireAdmin(context.currentUser)

            const userToDelete = await User.findById(id)

            if (!userToDelete) {
                throw new Error("Käyttäjää ei löytynyt")
            }

            if (userToDelete.email === 'pkpirttiry@surffi.fi') {
                throw new Error("Pääkäyttäjää ei voi poistaa!")
            }

            await User.findByIdAndDelete(id)

            return userToDelete
        }),

        updateNotifications: handleErrors(async (_root, { id, notifications }, context) => {
            requireAdmin(context.currentUser)

            const user = await User.findById(id)
            if (!user) {
                throw new Error("Käyttäjää ei löytynyt")
            }

            if (typeof user.notifications === "undefined") {
                user.notifications = false
            }

            user.notifications = notifications

            await user.save()
            return user
        }),

        updateContacts: handleErrors(async (_root, args, context) => {
            requireAdmin(context.currentUser)

            for (const key in args) {
                if (args[key] === null || args[key] === "") {
                    args[key] = undefined
                }
            }

            const validated = createContactsSchema.parse(args)

            const updated = await Contacts.findOneAndUpdate(
                {},
                    validated,
                {
                    new: true,
                    upsert: true,
                }
            )

        return updated

        }),

        createTopic: handleErrors(async (_root, { otsikko, ajankohta, teksti }, context) => {
            requireAdmin(context.currentUser)

            const newTopic = new Topic({
                otsikko,
                ajankohta: ajankohta || null,
                teksti,
                createdAt: new Date()
            })

            await newTopic.save()
            return newTopic
        }),

        deleteTopic: handleErrors(async (_root, { id }, context) => {
            requireAdmin(context.currentUser)

            const topicToDelete = Topic.findByIdAndDelete(id)
            if (!topicToDelete) throw new Error("VIRHE: ID-virhe. Dokumentti on ehkä jo poistettu.")

            return topicToDelete
        }),

        updateQuoteBlockTitle: handleErrors(async (_, { quotes_lohko, quotes_otsikko }, context) => {
            requireAdmin(context.currentUser)
            const update = {}
            update[`quotes_lohkot.lohko_${quotes_lohko}.quotes_otsikko`] = quotes_otsikko
            const updated = await Quotes.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true })
            return updated
        }),

        addQuote: handleErrors(async (_, { quotes_lohko, quote }, context) => {
            requireAdmin(context.currentUser)

            const quoteObj = {
                _id: new mongoose.Types.ObjectId(),
                text: quote
            }

            const path = `quotes_lohkot.lohko_${quotes_lohko}.quotes`
            const updated = await Quotes.findOneAndUpdate(
                {},
                { $push: { [path]: quoteObj } },
                { new: true, upsert: true }
            )
            return updated
        }),

        deleteQuote: handleErrors(async (_, { id }, context) => {
            requireAdmin(context.currentUser)

            const mainDoc = await Quotes.findOne({
                $or: [
                { 'quotes_lohkot.lohko_1.quotes._id': id },
                { 'quotes_lohkot.lohko_2.quotes._id': id },
                { 'quotes_lohkot.lohko_3.quotes._id': id },
                ],
            })

            if (!mainDoc) {
                throw new Error("VIRHE: Siteerausta ei löydy.")
            }

            let lohkoKey

            ['lohko_1', 'lohko_2', 'lohko_3'].forEach(lohko => {
                if (mainDoc.quotes_lohkot[lohko].quotes.some(q => q._id.toString() === id)) {
                lohkoKey = lohko
                }
            })

            if (!lohkoKey) {
                throw new Error("VIRHE: Siteerausta ei löydy.")
            }

            const deletedQuote = mainDoc.quotes_lohkot[lohkoKey].quotes.find(q => q._id.toString() === id)

            await Quotes.updateOne(
                { _id: mainDoc._id },
                { $pull: { [`quotes_lohkot.${lohkoKey}.quotes`]: { _id: id } } }
            )

            return deletedQuote
        }),

        updateDescription: handleErrors(async (_, { quotes_kuvaus }, context) => {
            requireAdmin(context.currentUser)
            const updated = await Quotes.findOneAndUpdate({}, { $set: { quotes_kuvaus } }, { new: true, upsert: true })
            return updated
        }),

        login: handleErrors(async (_root, { email, password }) => {
            const user = await User.findOne({ email: email.toLowerCase().trim() })
            if (!user) throw new Error("Käyttäjää ei löytynyt")

            const valid = await bcrypt.compare(password, user.passwordHash)
            if (!valid) throw new Error("Virheellinen käyttäjätunnus tai salasana!")

            const userToken = {
                email: user.email,
                id: user._id,
                admin: user.admin,
                notifications: user.notifications
            }

            return { value: jwt.sign(userToken, process.env.JWT_SECRET) }
        }),

        updatePassword: handleErrors(async (_root, { id, newPassword }, context) => {
            requireAdmin(context.currentUser)

            createUserSchema.parse({ email: context.currentUser.email, password: newPassword, admin: context.currentUser.admin })


            const passwordHash = await bcrypt.hash(newPassword, 10)

            const user = await User.findByIdAndUpdate(
                id,
                { passwordHash },
                { new: true }
            )

            if (!user) throw new Error("Käyttäjää ei löytynyt")

            return user
        }),

        createForm: handleErrors(async (_, { formType, input }) => {
            const formattedInput = formatNames(input)

            const encryptForm = (result) => {
                if (!result.success) {
                    let messages = []

                    if (Array.isArray(result.error?.issues)) {
                        messages = result.error.issues.map(issue => issue.message)
                    } else if (typeof result.error === 'string') {
                        messages = [result.error]
                    } else {
                        messages = ['Unknown error']
                    }

                    throw new GraphQLError(messages.join('\n'))
                }

                const sensitiveKeys = Object.keys(formattedInput).filter(
                    key => !['sukunimi_lapsi', 'syntymaaika', 'suostumus', 'allergiat', 'sairaalahoito', 'ulkomainen_ssn'].includes(key)
                )

                const encryptedInput = { ...formattedInput }

                sensitiveKeys.forEach(key => {
                    if (formattedInput[key] != null) {
                        encryptedInput[key] = encryptField(String(formattedInput[key]))
                    }
                })

                return encryptedInput
            }

            let form

            if (formType === 'vkh') {
                const encryptedInput = encryptForm(createDayCareFormSchema.safeParse(formattedInput))
                form = new DayCareForm({...encryptedInput, formType: formType, read: false})
            } else if (formType === 'ekh') {
                const encryptedInput = encryptForm(createPreSchoolFormSchema.safeParse(formattedInput))
                form = new PreSchoolForm({...encryptedInput, formType: formType, read: false})
            } else {
                throw new Error('Tuntematon lomaketyyppi: ' + formType)
            }
            await form.save()
            const receivers = await User.find({ notifications: true })
            await MailSender(formType, receivers, formattedInput)

            if (!form._id) {
                throw new GraphQLError('Lomakkeen tallennus epäonnistui')
            }

            return form.id
        }),

        markFormRead: handleErrors(async (_, { id, formType }, context) => {
            requireAdmin(context.currentUser)

            const Model = formType === "vkh" ? DayCareForm : PreSchoolForm

            if (!Model) {
                throw new GraphQLError('Tuntematon lomaketyyppi: ' + formType)
            }

            const form = await Model.findByIdAndUpdate(
                id,
                {
                    read: true,
                    handler: context.currentUser?.email
                },
                { new: true }
            )

            if (!form) {
                throw new GraphQLError('Lomaketta ei löytynyt')
            }

            return form.toObject()
        }),

        deleteApplication: handleErrors(async (_, { id, formType }, context) => {
            requireAdmin(context.currentUser)

            const Model = formType === "vkh" ? DayCareForm : PreSchoolForm

            if (!Model) {
                throw new GraphQLError('Tuntematon lomaketyyppi: ' + formType)
            }

            const deleted = await Model.findByIdAndDelete(id)

            if (!deleted) {
                throw new GraphQLError('Lomaketta ei löytynyt')
            }

            return deleted
        }),

        uploadInternalControl: handleErrors(async (_, { file }, context) => {
            requireAdmin(context.currentUser)

            const { createReadStream, filename } = await file

            const stream = createReadStream()
            const chunks = []
            for await (const chunk of stream) {
                chunks.push(chunk)
            }
            const pdfBuffer = Buffer.concat(chunks)

            await ICPlan.deleteMany({})

            const saved = await ICPlan.create({
                filename,
                pdf: pdfBuffer,
                contentType: "application/pdf",
                updatedAt: new Date()
            })

            return {
                filename: saved.filename,
                pdf: saved.pdf.toString("base64"),
            }
        }),

        uploadPrivacyPolicy: handleErrors(async (_, { file }, context) => {
            requireAdmin(context.currentUser)

            const { createReadStream, filename } = await file

            const stream = createReadStream()
            const chunks = []
            for await (const chunk of stream) {
                chunks.push(chunk)
            }
            const pdfBuffer = Buffer.concat(chunks)

            await PrivacyPolicy.deleteMany({})

            const saved = await PrivacyPolicy.create({
                filename,
                pdf: pdfBuffer,
                contentType: "application/pdf",
                updatedAt: new Date()
            })

            return {
                filename: saved.filename,
                pdf: saved.pdf.toString("base64"),
            }
        }),

        uploadBylaws: handleErrors(async (_, { file }, context) => {
            requireAdmin(context.currentUser)

            const { createReadStream, filename } = await file

            const stream = createReadStream()
            const chunks = []
            for await (const chunk of stream) {
                chunks.push(chunk)
            }
            const pdfBuffer = Buffer.concat(chunks)

            await Bylaws.deleteMany({})

            const saved = await Bylaws.create({
                filename,
                pdf: pdfBuffer,
                contentType: "application/pdf",
                updatedAt: new Date()
            })

            return {
                filename: saved.filename,
                pdf: saved.pdf.toString("base64"),
            }
        })
    }
}

export default resolvers