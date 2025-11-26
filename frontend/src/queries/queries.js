import { gql } from '@apollo/client'

export const ADD_USER = gql`
  mutation CreateUser(
    $email: String!, 
    $password: String!, 
    $admin: Boolean!
  ) {
    createUser(
      email: $email, 
      password: $password, 
      admin: $admin
    ) {
      id
      email
      admin
      token
      notifications
    }
  }
`

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      value
    }
  }
`

export const CREATE_FORM = gql`
  mutation CreateForm($formType: FormType!, $input: JSON!) {
    createForm(formType: $formType, input: $input)
  }
`

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($id: ID!, $newPassword: String!) {
    updatePassword(id: $id, newPassword: $newPassword) {
      id
    }
  }
`

export const UPDATE_NOTIFICATIONS = gql`
  mutation updateNotifications($id: ID!, $notifications: Boolean!) {
    updateNotifications(id: $id, notifications: $notifications) {
      id
      notifications
    }
  }
`

export const USERS = gql`
  query getUsers {
    users {
      id
      email
      admin
      notifications
    }
  }
`

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      email
    }
  }
`

export const GET_FORM = gql`
  query GetForm($id: ID!, $formType: FormType!) {
    getForm(id: $id, formType: $formType) {
      id
      etunimet_lapsi
      sukunimi_lapsi
      syntymaaika
      sotu
      ulkomainen_henkilotunnus
      ulkomainen_ssn
      kieli
      katuosoite
      postinumero
      lemmikit
      etunimet_aikuinen_1
      sukunimi_aikuinen_1
      tyollisyys_aikuinen_1
      tyonantaja_tai_oppilaitos_aikuinen_1
      puhelinnumero_aikuinen_1
      tyoaika_aikuinen_1
      sahkoposti_aikuinen_1
      etunimet_aikuinen_2
      sukunimi_aikuinen_2
      tyollisyys_aikuinen_2
      tyonantaja_tai_oppilaitos_aikuinen_2
      puhelinnumero_aikuinen_2
      tyoaika_aikuinen_2
      sahkoposti_aikuinen_2
      suhde
      asuminen
      tarve
      paivat
      alkamispaiva
      alkamisaika
      paattymisaika
      paivahoito
      kuljetus
      muut_lapset
      suostumus
      neuvola
      allergiat
      sairaalahoito
      muut_terveystiedot
      sairaala
      lisatiedot
      read
      formType
      createdAt
      updatedAt
      handler
    }
  }
`

export const GET_ALL_FORMS = gql`
  query GetAllForms($formType: FormType, $limit: Int, $skip: Int, $search: SearchInput, $read: Boolean) {
    getForms(formType: $formType, limit: $limit, skip: $skip, search: $search, read: $read) {
      vkh {
        totalCount
        unreadCount
        forms {
          id
          sukunimi_lapsi
          syntymaaika
          read
          formType
          createdAt
          updatedAt
          handler
        }
      }
      ekh {
        totalCount
        unreadCount
        forms {
          id
          sukunimi_lapsi
          syntymaaika
          read
          formType
          createdAt
          updatedAt
          handler
        }
      }
    }
  }
`

export const GET_CONTACTS = gql`
  query getContacts {
    getContacts {
      puhelin_1
      puhelin_2
      puhelin_3
      sahkoposti
    }
  }
`

export const MARK_FORM_READ = gql`
  mutation MarkAllRead($id: ID!, $formType: FormType!) {
    markFormRead(id: $id, formType: $formType) {
      read
    }
  }
`

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: ID!, $formType: FormType!) {
    deleteApplication(id: $id, formType: $formType) {
      id
    }
  }
`

export const UPDATE_CONTACTS = gql`
  mutation UpdateContacts($puhelin_1: String, $puhelin_2: String, $puhelin_3: String, $sahkoposti: String) {
    updateContacts(puhelin_1: $puhelin_1, puhelin_2: $puhelin_2, puhelin_3: $puhelin_3, sahkoposti: $sahkoposti) {
      puhelin_1
      puhelin_2
      puhelin_3
      sahkoposti
    }
  }
`


export const CREATE_TOPIC = gql`
  mutation CreateTopic($otsikko: String!, $ajankohta: String, $teksti: String!) {
    createTopic(otsikko: $otsikko, ajankohta: $ajankohta, teksti: $teksti) {
      id
      otsikko
      ajankohta
      teksti
      createdAt
    }
  }
`

export const GET_TOPICS = gql`
  query GetTopics {
    getTopics {
      id
      otsikko
      ajankohta
      teksti
      createdAt
    }
  }
`

export const GET_QUOTES = gql`
  query GetQuotes {
    quotes {
      id
      quotes_kuvaus
      quotes_lohkot {
        lohko_1 { quotes_otsikko quotes { id text } }
        lohko_2 { quotes_otsikko quotes { id text } }
        lohko_3 { quotes_otsikko quotes { id text } }
      }
    }
  }
`

export const UPDATE_QUOTE_TITLE = gql`
  mutation UpdateQuoteBlockTitle($quotes_lohko: Int!, $quotes_otsikko: String!) {
    updateQuoteBlockTitle(quotes_lohko: $quotes_lohko, quotes_otsikko: $quotes_otsikko) {
      quotes_lohkot {
        lohko_1 { quotes_otsikko quotes { id text } }
        lohko_2 { quotes_otsikko quotes { id text } }
        lohko_3 { quotes_otsikko quotes { id text } }
      }
    }
  }
`

export const ADD_QUOTE = gql`
  mutation AddQuote($quotes_lohko: Int!, $quote: String!) {
    addQuote(quotes_lohko: $quotes_lohko, quote: $quote) {
      quotes_lohkot {
        lohko_1 { quotes_otsikko quotes { id text } }
        lohko_2 { quotes_otsikko quotes { id text } }
        lohko_3 { quotes_otsikko quotes { id text } }
      }
    }
  }
`

export const UPDATE_QUOTE_DESCRIPTION = gql`
  mutation UpdateDescription($quotes_kuvaus: String!) {
    updateDescription(quotes_kuvaus: $quotes_kuvaus) {
      quotes_kuvaus
    }
  }
`

export const DELETE_QUOTE = gql`
  mutation DeleteQuote($id: ID!) {
    deleteQuote(id: $id) {
      text
    }
  }
`

export const UPLOAD_INTERNAL_CONTROL = gql`
  mutation UploadInternalControl($file: Upload!) {
    uploadInternalControl(file: $file) {
      filename
      pdf
    }
  }
`

export const GET_INTERNAL_CONTROL_PDF = gql`
  query internalControlDocument {
    internalControlDocument {
      filename
      pdf
    }
  }
`

export const DELETE_TOPIC = gql`
  mutation deleteTopic($id: ID!) {
    deleteTopic(id: $id) {
      otsikko
    }
  }
`

export const UPLOAD_PRIVACY_POLICY = gql`
  mutation uploadPrivacyPolicy($file: Upload!) {
    uploadPrivacyPolicy(file: $file) {
      filename
      pdf
    }
  }
`

export const GET_PRIVACY_POLICY = gql`
  query privacyPolicyDocument {
    privacyPolicyDocument {
      filename
      pdf
    }
  }
`

export const UPLOAD_BYLAWS = gql`
  mutation uploadBylaws($file: Upload!) {
    uploadBylaws(file: $file) {
      filename
      pdf
    }
  }
`

export const GET_BYLAWS = gql`
  query bylawsDocument {
    bylawsDocument {
      filename
      pdf
    }
  }
`