import { EntityCollection as Collection } from 'cesium';
import { IEntity } from '../types';

export class EntityCollection {
  private _entities: Collection;
  private entities: IEntity[] = [];

  constructor(entities: Collection) {
    this._entities = entities;
  }

  find(predicate: (e: IEntity) => boolean) {
    return this.entities.find(predicate);
  }

  add(entity: IEntity): IEntity {
    if (!this.contains(entity)) {
      this.entities.push(entity);
      this._entities.add((entity as any)._entity);
    }

    return entity;
  }

  remove(entity: IEntity): boolean {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      this._entities.remove((entity as any)._entity);
      return true;
    }
    return false;
  }

  contains(entity: IEntity): boolean {
    return this.entities.indexOf(entity) !== -1;
  }

  getById(id: string): IEntity | undefined {
    return this.entities.find((entity) => entity.id === id);
  }

  forEach(callback: (entity: IEntity) => void): void {
    this.entities.forEach(callback);
  }
}
