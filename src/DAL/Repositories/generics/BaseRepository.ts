import { DeepPartial, EntityTarget, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IGenericRepository } from './IBaseRepository';

@Injectable()
export class GenericRepository<E extends ObjectLiteral> implements IGenericRepository<E> {
  private repo: Repository<E>;

  constructor(private dataSource: DataSource, EntityClass: EntityTarget<E>) {
    this.repo = dataSource.getRepository(EntityClass);
  }

  /**
   * @description Creates a single entity
   * @param data - Entity data to create
   * @returns Created entity
   */
  async createOne(data: DeepPartial<E>): Promise<E> {
    const createdData = this.repo.create(data);
    return this.repo.save(createdData);
  }


  /**
   * @description Finds multiple entities
   * @param findManyOptions - Query options
   * @returns Object containing results and total count
   */
  async findMany(findManyOptions: FindManyOptions<E>): Promise<{ results: E[]; totalCount: number }> {
    const [results, totalCount] = await this.repo.findAndCount(findManyOptions);
    return { results, totalCount };
  }

  /**
   * @description Updates a single entity
   * @param findOptions - Query options to find entity
   * @param data - Data to update
   * @returns Update result
   */
  async updateOne(findOptions: FindOptionsWhere<E>, data: Partial<E>): Promise<UpdateResult> {
    return this.repo.update(findOptions, data);
  }

  /**
   * @description Saves an entity
   * @param entity - Entity to save
   * @returns Saved entity
   */
  async save(entity: E): Promise<E> {
    return this.repo.save(entity);
  }

  /**
   * @description Checks if an entity exists
   * @param findOptions - Query options
   * @returns Boolean indicating existence
   */
  async exists(findOptions: FindManyOptions<E>): Promise<boolean> {
    return this.repo.exists(findOptions);
  }

}