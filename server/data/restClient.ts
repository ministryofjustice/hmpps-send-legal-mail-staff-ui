import superagent from 'superagent'
import { HttpAgent, HttpsAgent } from 'agentkeepalive'

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
  retry?: boolean
}

interface PutRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
  retry?: boolean
}

interface DeleteRequest {
  path?: string
  query?: string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

export default class RestClient {
  agent: HttpAgent

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
    private readonly token: string = undefined,
    private readonly sourceIp: string = undefined,
  ) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new HttpAgent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get<Response = unknown>({
    path = null,
    query = '',
    headers = {},
    responseType = '',
    raw = false,
  }: GetRequest = {}): Promise<Response> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path} ${query}`)
    try {
      const request = superagent.get(`${this.apiUrl()}${path}`)

      request
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      if (this.token) {
        request.auth(this.token, { type: 'bearer' })
      }

      const result = await request
      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async post<Response = unknown>({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
    retry = false,
  }: PostRequest = {}): Promise<Response> {
    logger.info(`Post using user credentials: calling ${this.name}: ${path}`)
    try {
      const request = superagent.post(`${this.apiUrl()}${path}`)

      request
        .send(data)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      if (this.sourceIp) {
        request.set('x-slm-client-ip', this.sourceIp)
      }

      const result = await request
      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'POST'`)
      throw sanitisedError
    }
  }

  async put<Response = unknown>({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
    retry = false,
  }: PutRequest = {}): Promise<Response> {
    logger.info(`Put using user credentials: calling ${this.name}: ${path}`)
    try {
      const request = superagent.put(`${this.apiUrl()}${path}`)

      request
        .send(data)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      if (this.sourceIp) {
        request.set('x-slm-client-ip', this.sourceIp)
      }

      const result = await request
      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'PUT'`)
      throw sanitisedError
    }
  }

  async delete<Response = unknown>({
    path = null,
    query = '',
    headers = {},
    responseType = '',
    raw = false,
  }: DeleteRequest = {}): Promise<Response> {
    logger.info(`Delete using user credentials: calling ${this.name}: ${path} ${query}`)
    try {
      const result = await superagent
        .delete(`${this.apiUrl()}${path}`)
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

      return raw ? (result as Response) : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`)
      throw sanitisedError
    }
  }
}
