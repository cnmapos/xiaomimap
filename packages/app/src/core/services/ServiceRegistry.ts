import { IService } from "./IService";

export class ServiceRegistry {
  private static services = new Map<string, IService>();

  static register(service: IService) {
    this.services.set(service.id, service);
  }

  static get<T extends IService>(serviceId: string): T | undefined {
    return this.services.get(serviceId) as T;
  }
}
