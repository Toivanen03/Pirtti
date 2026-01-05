import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

const formatStringToReplace = (string) => {
    return new RegExp(`{{\\s*${string}\\s*}}`, 'g')
}

const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
}

const MailSender = async (formType, receivers, data) => {
    const notificationTransporter = nodemailer.createTransport({
        host: "mail.pkpirttiry.fi",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASS
        }
    })

    if (data && Array.isArray(receivers) && formType !== null) {
        const subject = 'Uusi hoitopaikkahakemus'
        const template = fs.readFileSync(path.resolve('emailTemplate', 'newApplication.html'), 'utf-8')
        const sendResults = await Promise.allSettled(
            receivers.map(receiver => {

                const personalizedHtml = template
                .replace(formatStringToReplace('FORM_TYPE'), formType === 'vkh' ? 'varhaiskasvatushakemus' : 'esikasvatushakemus')
                .replace(formatStringToReplace('CHILD_LASTNAME'), data.sukunimi_lapsi || '')
                .replace(formatStringToReplace('CHILD_BIRTHDAY'), formatDate(data.syntymaaika) || '')
                .replace(formatStringToReplace('PHONE'), data.puhelinnumero_aikuinen_1 ?? '')

                return notificationTransporter.sendMail({
                    from: `Pirtti <postittaja@pkpirttiry.fi>`,
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

    } else if (typeof receivers === 'string') {
        const subject = 'PALVELINVIRHE'
        const message = fs.readFileSync(path.resolve('emailTemplate', 'errorTemplate.html'), 'utf-8').replace(formatStringToReplace('ERROR'), data)
        const sendResults = await Promise.allSettled([
            notificationTransporter.sendMail({
                from: `Pirtti <postittaja@pkpirttiry.fi>`,
                to: receivers,
                subject,
                html: message
            })
        ])

        const failures = sendResults.filter(r => r?.status === 'rejected')
        if (failures.length > 0) {
            failures.forEach(f => console.error(failures.length, ' Sähköpostin lähetys epäonnistui:', f.reason))
        }
    }
}

export default MailSender