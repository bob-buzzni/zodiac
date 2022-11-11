import * as R from 'ramda';

export default class Node {
  readonly id!: number;
  type: 'directory' | 'file' = 'file';
  icon: string = '';
  parent_id!: number;
  thumbnail: string = '';
  subject!: string;
  description: string = '';
  content: string = '';
  tags: string = '';
  author!: number;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  children: Node[] = [];

  // state
  isSelected: boolean = false;
  constructor(item: typeof Node) {
    const instance: typeof Node & { [key: string]: any } = item;

    for (let key in item) {
      const value = instance[key];
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: false,
        writable: true,
        value,
      });
    }
  }

  isDirectory() {
    return this.type === 'directory';
  }
}
