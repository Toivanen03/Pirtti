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

<<<<<<< HEAD
const MailSender = async (formType, receivers, application) => {
=======
const MailSender = async (formType, receivers, data) => {
>>>>>>> temp
    const notificationTransporter = nodemailer.createTransport({
        host: "mail.pkpirttiry.fi",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASS
        }
    })

<<<<<<< HEAD
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
            from: `Pirtti <postittaja@pkpirttiry.fi>`,
            to: receiver.email,
            subject,
            html: personalizedHtml
            })
        }).filter(Boolean)
=======
    if (data && Array.isArray(receivers) && formType !== null) {
        const subject = 'Uusi hoitopaikkahakemus'
        const template = fs.readFileSync(path.resolve('emailTemplate', 'newApplication.html'), 'utf-8')
        const sendResults = await Promise.allSettled(
            receivers.map(receiver => {

                const personalizedHtml = template
                .replace('{{FORM_TYPE}}', formType === 'vkh' ? 'varhaiskasvatushakemus' : 'esikasvatushakemus')
                .replace('{{CHILD_LASTNAME}}', data.sukunimi_lapsi || '')
                .replace('{{CHILD_BIRTHDAY}}', formatDate(data.syntymaaika) || '')

                return notificationTransporter.sendMail({
                    from: `Pirtti <postittaja@pkpirttiry.fi>`,
                    to: receiver.email,
                    subject,
                    html: personalizedHtml
                })
            }).filter(Boolean)
>>>>>>> temp
        )

        const failures = sendResults.filter(r => r?.status === 'rejected')
        if (failures.length > 0) {
            failures.forEach(f => console.error(failures.length, ' Sähköpostin lähetys epäonnistui:', f.reason))
        }
<<<<<<< HEAD
=======

    } else if (typeof receivers === 'string') {
        const subject = 'PALVELINVIRHE'
        const message = fs.readFileSync(path.resolve('emailTemplate', 'errorTemplate.html'), 'utf-8').replace('{{ERROR}}', data)
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
>>>>>>> temp
    }
}

export default MailSender