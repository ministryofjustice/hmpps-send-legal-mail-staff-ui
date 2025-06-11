import crypto from 'crypto'
import { Request } from 'express'
import config from '../../config'
import type { RedisClient } from '../redisClient'
import logger from '../../../logger'

export default class SmokeTestStore {
  private readonly prefix = 'smokeTest:'

  private readonly key = 'smokeTest'

  constructor(private readonly client: RedisClient) {
    client.on('error', error => {
      logger.error(error, `Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async setSmokeTestSecret(oneTimeSecret: string): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${this.key}`, oneTimeSecret, { EX: 60 })
  }

  public async getSmokeTestSecret(): Promise<string> {
    await this.ensureConnected()
    const result = await this.client.get(`${this.prefix}${this.key}`)
    return Buffer.isBuffer(result) ? result.toString() : result
  }

  public async startSmokeTest(req: Request): Promise<string> {
    if (!req.body?.msjSecret || !config.smoketest.msjSecret) return ''
    const secret = req.body.msjSecret
    if (secret === config.smoketest.msjSecret) {
      const oneTimeSecret = crypto.randomBytes(20).toString('hex')
      await this.setSmokeTestSecret(oneTimeSecret)
      return oneTimeSecret
    }
    return ''
  }
}
