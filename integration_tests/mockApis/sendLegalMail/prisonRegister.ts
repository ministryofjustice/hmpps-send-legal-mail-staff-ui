import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

const stubGetPrisonRegister = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-register/prisons',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          prisonId: 'ALI',
          prisonName: 'Albany (HMP)',
          active: false,
          male: false,
          female: false,
          types: [],
          addresses: [],
        },
        {
          prisonId: 'AKI',
          prisonName: 'Acklington (HMP)',
          active: false,
          male: false,
          female: false,
          types: [],
          addresses: [],
        },
        {
          prisonId: 'KTI',
          prisonName: 'Kennet (HMP)',
          active: false,
          male: false,
          female: false,
          types: [],
          addresses: [],
        },
        {
          prisonId: 'ACI',
          prisonName: 'Altcourse (HMP)',
          active: true,
          male: true,
          female: false,
          types: [
            {
              code: 'HMP',
              description: 'Her Majesty’s Prison',
            },
          ],
          addresses: [
            {
              id: 1,
              addressLine1: 'Brookfield Drive',
              addressLine2: 'Fazakerley',
              town: 'Liverpool',
              county: 'Lancashire',
              postcode: 'L9 7LH',
              country: 'England',
            },
          ],
        },
        {
          prisonId: 'ASI',
          prisonName: 'Ashfield (HMP)',
          active: true,
          male: true,
          female: false,
          types: [
            {
              code: 'HMP',
              description: 'Her Majesty’s Prison',
            },
          ],
          addresses: [
            {
              id: 2,
              addressLine1: 'Shortwood Road',
              addressLine2: 'Pucklechurch',
              town: 'Bristol',
              county: 'Gloucestershire',
              postcode: 'BS16 9QJ',
              country: 'England',
            },
          ],
        },
        {
          prisonId: 'SKI',
          prisonName: 'Stocken (HMP)',
          active: true,
          male: true,
          female: false,
          types: [
            {
              code: 'HMP',
              description: 'Her Majesty’s Prison',
            },
          ],
          addresses: [
            {
              id: 102,
              addressLine1: 'Stocken Hall Road',
              addressLine2: 'Stretton',
              town: 'Oakham',
              county: 'Rutland',
              postcode: 'LE15 7RD',
              country: 'England',
            },
          ],
        },
        {
          prisonId: 'LEI',
          prisonName: 'Leeds (HMP)',
          active: true,
          male: true,
          female: false,
          types: [
            {
              code: 'HMP',
              description: 'Her Majesty’s Prison',
            },
          ],
          addresses: [
            {
              id: 63,
              addressLine1: '2 Gloucester Terrace',
              addressLine2: 'Stanningley Road',
              town: 'Leeds',
              county: 'West Yorkshire',
              postcode: 'LS12 2TJ',
              country: 'England',
            },
          ],
        },
      ],
    },
  })

export default { stubGetPrisonRegister }
