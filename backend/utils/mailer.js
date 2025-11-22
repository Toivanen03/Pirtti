import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
}

const MailSender = async (formType, receivers, application) => {
    const mail = process.env.MAIL

    const notificationTransporter = nodemailer.createTransport({
        host: 'smtp.protonmail.ch',
        port: 587,
        secure: true,
        auth: {
            user: mail,
            pass: process.env.EMAIL_PASS
        }
    })

    if (application) {
        const subject = 'Uusi hoitopaikkahakemus'
        const template = fs.readFileSync(path.resolve('emailTemplate', 'newApplication.html'), 'utf-8')
        const sendResults = await Promise.allSettled(
        receivers.map(receiver => {
            const personalizedHtml = template
            .replace('{{FORM_TYPE}}', formType === 'vkh' ? 'varhaiskasvatushakemus' : 'esikasvatushakemus')
            .replace('{{CHILD_LASTNAME}}', application.sukunimi_lapsi || '')
            .replace('{{CHILD_BIRTHDAY}}', formatDate(application.syntymaaika) || '')

            return notificationTransporter.sendMail({
            from: `Pirtti <pkpirtti@protonmail.com>`,
            to: receiver.email,
            subject,
            html: personalizedHtml
            })
        }).filter(Boolean)
        )

        const failures = sendResults.filter(r => r?.status === 'rejected')
        if (failures.length > 0) {
            failures.forEach(f => console.error(failures.length, ' Sähköpostin lähetys epäonnistui:', f.reason))
        }
    }
}

export default MailSender