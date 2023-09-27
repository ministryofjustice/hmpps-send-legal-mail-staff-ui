import fs from 'fs'
import * as cheerio from 'cheerio'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../utils/nunjucksSetup'

const snippet = fs.readFileSync('server/views/layout.njk')

describe('Layout', () => {
  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

  beforeEach(() => {
    compiledTemplate = nunjucks.compile(snippet.toString(), njkEnv)
  })

  it('should render view', () => {
    viewContext = { pageId: 'some-page' }
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    expect($('#some-page').length).toStrictEqual(1)
  })
})
