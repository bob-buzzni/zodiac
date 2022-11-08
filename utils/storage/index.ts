import Directory from './Directory';
import File from './File';

export const createNode = (item: any) => {
  return item.type === 'file' ? new File(item) : new Directory(item);
};

export const transform = (items: any[]) => {
  return items.map(createNode);
};

export { default as Node } from './Node';
export { default as File } from './File';
