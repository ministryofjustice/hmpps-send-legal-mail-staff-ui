import superagent from 'superagent'
import type { Response, ResponseError } from 'superagent'
import Agent, { HttpsAgent } from 'agentkeepalive'

import logger from '../../logger'
import sanitiseError from '../sanitisedError'
import { ApiConfig } from '../config'
import { restClientMetricsMiddleware } from './restClientMetricsMiddleware'

interface GetRequest {
  path?: string
  query?: string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

interface PostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
}

interface PutRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
}

interface DeleteRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
}

export default class RestClient {
  agent: Agent

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
    private readonly token: string = undefined,
    private readonly sourceIp: string = undefined,
  ) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get({ path = null, query = '', headers = {}, responseType = '', raw = false }: GetRequest): Promise<unknown> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path} ${query}`)
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? result : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async post({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
  }: PostRequest = {}): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, data, raw, method: 'post' })
  }

  async put({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
  }: PutRequest = {}): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, data, raw, method: 'put' })
  }

  async delete({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
  }: DeleteRequest = {}): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, data, raw, method: 'delete' })
  }

  private async processRequest({
    path = null,
    headers = {},
    responseType = '',
    query = undefined,
    data = undefined,
    raw = false,
    method = undefined as 'get' | 'post' | 'put' | 'delete',
  } = {}): Promise<unknown> {
    const request = superagent[method](`${this.apiUrl()}${path}`)
    request
      .agent(this.agent)
      .retry(2, (err: ResponseError): void => {
        if (err) logger.info(`Retry handler found API error with ${err.status} ${err.message}`)
        return undefined // retry handler only for logging retries, not to influence retry logic
      })
      .set(headers)
      .responseType(responseType)
      .timeout(this.timeoutConfig())

    if (data) {
      request.send(data)
    }
    if (query) {
      request.query(query)
    }

    request.auth(this.token, { type: 'bearer' })
    if (this.sourceIp) {
      request.set('x-slm-client-ip', this.sourceIp)
    }

    return request
      .then((result: Response) => (raw ? result : result.body))
      .catch((error: ResponseError): void => {
        const sanitisedError = sanitiseError(error)
        logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: ${method.toUpperCase()}`)
        throw sanitisedError
      })
  }
}
