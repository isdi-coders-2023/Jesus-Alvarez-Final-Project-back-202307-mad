/* eslint-disable no-unused-vars */
export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(id: X['id']): Promise<X>;
  search?({ key, value }: { key: string; value: string }): Promise<X[]>;
  create(newData: Omit<X, 'id'>): Promise<X>;
  update(id: X['id'], newData: Partial<X>): Promise<X>;
  delete(id: X['id']): Promise<void>;
}
