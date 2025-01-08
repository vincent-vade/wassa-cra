export type CrudRepository<T, U> = {
  findAll: () => Promise<T[]>;
  findOne: (data: T) => Promise<T>;
  create: (data: U) => Promise<T>;
  update: (id: string, data: Partial<U>) => Promise<{ id: string }>;
  delete: (id: string) => Promise<void>;
}