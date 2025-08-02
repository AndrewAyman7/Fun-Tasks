import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, UpdateResult} from 'typeorm';

export interface IGenericRepository<E extends ObjectLiteral> {
  createOne(data: DeepPartial<E>): Promise<E>;
  findMany(findManyOptions: FindManyOptions<E>): Promise<{ results: E[]; totalCount: number }>;
  updateOne(findOptions: FindOptionsWhere<E>, data: Partial<E>): Promise<UpdateResult>;
  save(entity: E): Promise<E>;
  exists(findOptions: FindManyOptions<E>): Promise<boolean>;
}
