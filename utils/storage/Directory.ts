import * as R from 'ramda';
import Node from './Node';

export default class Directory extends Node {
  icon: string = '/icons/folder.png'
  toJSON() {
    return R.pipe(
      R.pick(Object.getOwnPropertyNames(this)),
      R.omit(['depth', 'content'])
    )(this);
  }
}
