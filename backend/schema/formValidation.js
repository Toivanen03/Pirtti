import { z } from 'zod'

const phoneRegex = /^(\+|0)[0-9\s]+$/

const check = (data, ctx) => {
    const finnishSotuRegex = /^A\d{3}[0-9A-Z]$/

    if (data.ulkomainen_ssn) {
        if (typeof data.ulkomainen_henkilotunnus !== "string" || data.ulkomainen_henkilotunnus.trim().length < 3) {
            ctx.addIssue({
                code: "custom",
                path: ["ulkomainen_henkilotunnus"],
                message: "Virheellinen henkilötunnus"
            })
        }
    } else {
        if (data.kieli === "Suomi" || data.kieli === "Ruotsi") {
            if (!finnishSotuRegex.test(data.sotu)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["sotu"],
                    message: "Virheellinen henkilötunnus"
                })
            }
        } else {
            if (typeof data.sotu !== "string" || data.sotu.length < 3) {
                ctx.addIssue({
                    code: "custom",
                    path: ["sotu"],
                    message: "Henkilötunnus on liian lyhyt"
                })
            }
        }

        if (!calculateAge(data.syntymaaika)) {
            ctx.addIssue({
                code: "custom",
                path: ["syntymaaika"],
                message: "Lapsi ei ole varhaiskasvatusikäinen"
            })
        }
    }

    const phoneFields = ["puhelinnumero_aikuinen_1", "puhelinnumero_aikuinen_2"]
    phoneFields.forEach(field => {
        const val = data[field]
        if (val && !phoneRegex.test(val)) {
            ctx.addIssue({
                code: "custom",
                path: [field],
                message: field === "puhelinnumero_aikuinen_1"
                    ? "Ensimmäisen huoltajan puhelinnumero on virheellistä muotoa"
                    : "Toisen huoltajan puhelinnumero on virheellistä muotoa"
            })
        }
    })

    if (data.tyollisyys_aikuinen_1 === "Työssä") {
        if (!data.tyonantaja_tai_oppilaitos_aikuinen_1 || data.tyonantaja_tai_oppilaitos_aikuinen_1.trim() === "") {
            ctx.addIssue({
                code: "custom",
                path: ["tyonantaja_tai_oppilaitos_aikuinen_1"],
                message: "Huoltajan työpaikkatieto on pakollinen",
            })
        }

        if (!data.tyoaika_aikuinen_1 || data.tyoaika_aikuinen_1.trim() === "") {
        ctx.addIssue({
            code: "custom",
            path: ["tyoaika_aikuinen_1"],
            message: "Huoltajan työaika on pakollinen",
        })
    }
}}


const calculateAge = (val) => {
    const birthday = new Date(val)
    const today = new Date()
    if (isNaN(birthday)) return false

    let age = today.getFullYear() - birthday.getFullYear()
    const m = today.getMonth() - birthday.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--
    }

    return age >= 0 && age <= 10
}

export const createDayCareFormSchema = z.object({
    etunimet_lapsi: z.string().min(2, { message: "Lapsen etunimi on liian lyhyt" }),
    sukunimi_lapsi: z.string().min(2, { message: "Lapsen sukunimi on liian lyhyt" }),
    syntymaaika: z.string(),
    sotu: z.string().optional(),
    ulkomainen_ssn: z.boolean(),
    ulkomainen_henkilotunnus: z.string().optional(),
    kieli: z.string(),
    katuosoite: z.string().refine(val => val.includes(" "), {
        message: "Virheellinen katuosoite"
    }),
    postinumero: z.string().regex(/^\d{5}$/, "Virheellinen postinumero"),
    lemmikit: z.string().optional(),
    etunimet_aikuinen_1: z.string().min(2, { message: "Huoltajan etunimi on liian lyhyt" }),
    sukunimi_aikuinen_1: z.string().min(2, { message: "Huoltajan sukunimi on liian lyhyt" }),
    tyollisyys_aikuinen_1: z.string(),
    tyonantaja_tai_oppilaitos_aikuinen_1: z.string(),
    puhelinnumero_aikuinen_1: z.string(),
    tyoaika_aikuinen_1: z.string(),
    sahkoposti_aikuinen_1: z.email("Virheellinen sähköpostiosoite"),
    etunimet_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan etunimi on liian lyhyt" }).or(z.literal("")).optional(),
    sukunimi_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan sukunimi on liian lyhyt" }).or(z.literal("")).optional(),
    tyollisyys_aikuinen_2: z.string().min(2).or(z.literal("")).optional(),
    tyonantaja_tai_oppilaitos_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan työpaikan syöte on virheellinen" }).or(z.literal("")).optional(),
    puhelinnumero_aikuinen_2: z.string().optional().or(z.literal("")),
    tyoaika_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan työaikasyöte on virheellinen" }).or(z.literal("")).optional(),
    sahkoposti_aikuinen_2: z.email("Virheellinen sähköpostiosoite").optional().or(z.literal("")),
    suhde: z.string(),
    asuminen: z.string(),
    tarve: z.string(),
    paivat: z.string(),
    alkamispaiva: z.string(),
    alkamisaika: z.string(),
    paattymisaika: z.string(),
    muut_lapset: z.string().min(2, { message: 'Tarkista "Muut lapset"- kentän syöte' }),
    suostumus: z.boolean(),
    neuvola: z.string().optional(),
    allergiat: z.boolean(),
    sairaalahoito: z.boolean(),
    muut_terveystiedot: z.string().optional(),
    sairaala: z.string().optional(),
    lisatiedot: z.string().optional()
    })
    
    .superRefine((data, ctx) => {
        check(data, ctx)
})

export const createPreSchoolFormSchema = z.object({
    etunimet_lapsi: z.string().min(2, { message: "Lapsen etunimi on liian lyhyt" }),
    sukunimi_lapsi: z.string().min(2, { message: "Lapsen sukunimi on liian lyhyt" }),
    syntymaaika: z.string(),
    sotu: z.string().optional(),
    ulkomainen_ssn: z.boolean(),
    ulkomainen_henkilotunnus: z.string().optional(),
    kieli: z.string(),
    katuosoite: z.string().refine(val => val.includes(" "), {
        message: "Virheellinen katuosoite"
    }),
    postinumero: z.string().regex(/^\d{5}$/, "Virheellinen postinumero"),
    lemmikit: z.string().optional(),
    etunimet_aikuinen_1: z.string().min(2, { message: "Huoltajan etunimi on liian lyhyt" }),
    sukunimi_aikuinen_1: z.string().min(2, { message: "Huoltajan sukunimi on liian lyhyt" }),
    tyollisyys_aikuinen_1: z.string(),
    tyonantaja_tai_oppilaitos_aikuinen_1: z.string(),
    puhelinnumero_aikuinen_1: z.string(),
    tyoaika_aikuinen_1: z.string(),
    sahkoposti_aikuinen_1: z.email("Virheellinen sähköpostiosoite"),
    etunimet_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan etunimi on liian lyhyt" }).or(z.literal("")).optional(),
    sukunimi_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan sukunimi on liian lyhyt" }).or(z.literal("")).optional(),
    tyollisyys_aikuinen_2: z.string().min(2).or(z.literal("")).optional(),
    tyonantaja_tai_oppilaitos_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan työpaikan syöte on virheellinen" }).or(z.literal("")).optional(),
    puhelinnumero_aikuinen_2: z.string().optional().or(z.literal("")),
    tyoaika_aikuinen_2: z.string().min(2, { message: "Toisen huoltajan työaikasyöte on virheellinen" }).or(z.literal("")).optional(),
    sahkoposti_aikuinen_2: z.email("Virheellinen sähköpostiosoite").optional().or(z.literal("")),
    suhde: z.string(),
    asuminen: z.string(),
    paivahoito: z.string(),
    kuljetus: z.string(),
    muut_lapset: z.string().min(2, { message: 'Tarkista "Muut lapset"- kentän syöte' }),
    suostumus: z.boolean(),
    neuvola: z.string().optional(),
    allergiat: z.boolean(),
    sairaalahoito: z.boolean(),
    muut_terveystiedot: z.string().optional(),
    sairaala: z.string().optional(),
    lisatiedot: z.string().optional()
    })
    
    .superRefine((data, ctx) => {
        check(data, ctx)
})