import DpsComponentsClient, { AvailableComponent, Component } from '../data/dpsComponentClient'

export default class DpsComponentService {
  constructor(private readonly dpsFeComponentsClient: DpsComponentsClient) {}

  public async getComponent(component: AvailableComponent, token: string): Promise<Component> {
    return this.dpsFeComponentsClient.getComponent(component, token)
  }
}
