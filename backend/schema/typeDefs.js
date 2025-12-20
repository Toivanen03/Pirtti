import { gql } from 'graphql-tag'

const typeDefs = gql`
  scalar JSON
  scalar Upload

  enum FormType {
    vkh
    ekh
  }

  type Form {
    id: ID!
    etunimet_lapsi: String!
    sukunimi_lapsi: String!
    syntymaaika: String
    sotu: String
    ulkomainen_henkilotunnus: String
    ulkomainen_ssn: Boolean
    kieli: String!
    katuosoite: String!
    postinumero: String!
    lemmikit: String
    etunimet_aikuinen_1: String!
    sukunimi_aikuinen_1: String!
    tyollisyys_aikuinen_1: String!
    tyonantaja_tai_oppilaitos_aikuinen_1: String
    puhelinnumero_aikuinen_1: String!
    tyoaika_aikuinen_1: String
    sahkoposti_aikuinen_1: String!
    etunimet_aikuinen_2: String
    sukunimi_aikuinen_2: String
    tyollisyys_aikuinen_2: String
    tyonantaja_tai_oppilaitos_aikuinen_2: String
    puhelinnumero_aikuinen_2: String
    tyoaika_aikuinen_2: String
    sahkoposti_aikuinen_2: String
    suhde: String!
    asuminen: String!
    tarve: String
    paivat: String
    alkamispaiva: String
    alkamisaika: String
    paattymisaika: String
    paivahoito: String
    kuljetus: String
    muut_lapset: String!
    suostumus: Boolean
    neuvola: String
    allergiat: Boolean
    sairaalahoito: Boolean
    muut_terveystiedot: String
    sairaala: String
    lisatiedot: String
    read: Boolean!
    formType: FormType!
    createdAt: String
    updatedAt: String
    handler: String
  }

  type DayCareForm {
    id: ID!
    etunimet_lapsi: String!
    sukunimi_lapsi: String!
    syntymaaika: String
    sotu: String
    ulkomainen_henkilotunnus: String
    ulkomainen_ssn: Boolean!
    kieli: String!
    katuosoite: String!
    postinumero: String!
    lemmikit: String
    etunimet_aikuinen_1: String!
    sukunimi_aikuinen_1: String!
    tyollisyys_aikuinen_1: String!
    tyonantaja_tai_oppilaitos_aikuinen_1: String
    puhelinnumero_aikuinen_1: String!
    tyoaika_aikuinen_1: String
    sahkoposti_aikuinen_1: String!
    etunimet_aikuinen_2: String
    sukunimi_aikuinen_2: String
    tyollisyys_aikuinen_2: String
    tyonantaja_tai_oppilaitos_aikuinen_2: String
    puhelinnumero_aikuinen_2: String
    tyoaika_aikuinen_2: String
    sahkoposti_aikuinen_2: String
    suhde: String!
    asuminen: String!
    tarve: String!
    paivat: String!
    alkamispaiva: String!
    alkamisaika: String!
    paattymisaika: String!
    muut_lapset: String!
    suostumus: Boolean!
    neuvola: String
    allergiat: Boolean!
    sairaalahoito: Boolean!
    muut_terveystiedot: String
    sairaala: String
    lisatiedot: String
    createdAt: String
    updatedAt: String
  }

  type PreSchoolForm {
    id: ID!
    etunimet_lapsi: String!
    sukunimi_lapsi: String!
    syntymaaika: String
    sotu: String
    ulkomainen_henkilotunnus: String
    ulkomainen_ssn: Boolean!
    kieli: String!
    katuosoite: String!
    postinumero: String!
    lemmikit: String
    etunimet_aikuinen_1: String!
    sukunimi_aikuinen_1: String!
    tyollisyys_aikuinen_1: String!
    tyonantaja_tai_oppilaitos_aikuinen_1: String
    puhelinnumero_aikuinen_1: String!
    tyoaika_aikuinen_1: String
    sahkoposti_aikuinen_1: String!
    etunimet_aikuinen_2: String
    sukunimi_aikuinen_2: String
    tyollisyys_aikuinen_2: String
    tyonantaja_tai_oppilaitos_aikuinen_2: String
    puhelinnumero_aikuinen_2: String
    tyoaika_aikuinen_2: String
    sahkoposti_aikuinen_2: String
    suhde: String!
    asuminen: String!
    paivahoito: String!
    kuljetus: String!
    muut_lapset: String!
    suostumus: Boolean!
    neuvola: String
    allergiat: Boolean!
    sairaalahoito: Boolean!
    muut_terveystiedot: String
    sairaala: String
    lisatiedot: String
    createdAt: String
    updatedAt: String
  }

  type FormsGroup {
    forms: [Form!]!
    unreadCount: Int!
    totalCount: Int!
    createdAt: String!
    handler: String
    formType: String!
  }

  type FormsResponse {
    vkh: FormsGroup
    ekh: FormsGroup
  }

  extend type Query {
    getForms: FormsResponse
  }

  type User {
    id: ID!
    email: String!
    admin: String!
    token: String
    notifications: Boolean!
  }

  type Query {
    users: [User!]!
    getForm(id: ID!, formType: FormType!): Form
    getForms(formType: FormType
      limit: Int
      skip: Int
      search: SearchInput
      read: Boolean
    ): FormsResponse
    getContacts: Contacts
    getTopics: [Topic]
    quotes: Quotes
    internalControlDocument: InternalControl
    privacyPolicyDocument: PrivacyPolicy
    bylawsDocument: Bylaws
  }

  input SearchInput {
    id: ID
    sukunimi: String
    syntymaaika: String
    handler: String
  }

  type Token {
    value: String!
  }

  type Contacts {
    puhelin_1: String
    puhelin_2: String
    puhelin_3: String
    sahkoposti: String
  }

  type Topic {
    id: ID!
    otsikko: String!
    ajankohta: String
    teksti: String!
    createdAt: String!
  }

  type Quote {
    id: ID!
    text: String!
  }

  type QuotesLohkoData {
    quotes_otsikko: String
    quotes: [Quote]
  }

  type QuotesLohkot {
    lohko_1: QuotesLohkoData
    lohko_2: QuotesLohkoData
    lohko_3: QuotesLohkoData
  }

  type Quotes {
    id: ID!
    quotes_kuvaus: String
    quotes_lohkot: QuotesLohkot
  }

  type InternalControl {
    filename: String!
    pdf: String!
  }

  type PrivacyPolicy {
    filename: String!
    pdf: String!
  }

  type Bylaws {
    filename: String!
    pdf: String!
  }

  type Mutation {
    login(email: String!, password: String!): Token
    createUser(email: String!, password: String!, admin: Boolean!, notifications: Boolean): User
    deleteUser(id: ID!): User
    updatePassword(id: ID!, newPassword: String!): User
    updateContacts(puhelin_1: String, puhelin_2: String, puhelin_3: String, sahkoposti: String): Contacts
    updateNotifications(id: ID!, notifications: Boolean!): User
    createForm(formType: FormType!, input: JSON!): ID!
    markFormRead(id: ID!, formType: FormType!): Form
    deleteApplication(id: ID!, formType: FormType!): Form
    createTopic(otsikko: String!, ajankohta: String, teksti: String!): Topic
    updateQuoteBlockTitle(quotes_lohko: Int!, quotes_otsikko: String!): Quotes
    addQuote(quotes_lohko: Int!, quote: String!): Quotes
    updateDescription(quotes_kuvaus: String!): Quotes
    deleteQuote(id: ID!): Quote
    deleteTopic(id: ID!): Topic
    uploadInternalControl(file: Upload!): InternalControl!
    uploadPrivacyPolicy(file: Upload!): PrivacyPolicy!
    uploadBylaws(file: Upload!): Bylaws!
  }
`

export default typeDefs