import * as R from 'ramda';
import Node from './Node';

export default class File extends Node {
  icon: string = "/icons/misc.png";
  extension(){
    return R.pipe(
      R.split('.'),
      R.last
    )(this.subject)
  }
  toJSON() {
    return R.pipe(
      R.pick(Object.getOwnPropertyNames(this)),
      R.omit(['depth', 'children'])
    )(this);
  }
}
