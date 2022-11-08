import Directory from './storage/Directory';
import File from './storage/File';
import Node from './storage/Node';
function getParents(items: Node[], pid?: number) {
  return items.filter((item) => item.parent_id === (pid ?? 1));
}

function getChildren(parent: Node, items: Node[]) {
  return items.filter((item) => item.parent_id === parent.id);
}

function hierarchy(items: Node[], parent?: Node, pid?: number) {
  let node = !!parent ? getChildren(parent, items) : getParents(items, pid);
  if (node.length) {
    if (!!parent) {
      parent.children = node;
    }

    node.forEach((item) => {
      hierarchy(items, item);
    });
  }
  return node;
}

export default (items: any, pid?: number) => {
  return hierarchy(
    items.map((item: any) =>
      item.type === 'file' ? new File(item) : new Directory(item)
    ),
    undefined,
    pid
  );
};
