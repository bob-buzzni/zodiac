import { useState, useEffect, MouseEvent } from 'react';
import styles from './SortableList.module.css';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Node } from '~/utils/storage';
import clsx from 'clsx';
import * as Rx from 'rxjs';
import { action$ } from '~/store';
import { FolderEvent } from '../event';
type ItemType = {
  node: Node;
  onClick: (e: MouseEvent<HTMLDivElement>, item: Node) => void;
};
const Item: any = SortableElement(({ node, onClick = () => {} }: ItemType) => {
  const [state, setState] = useState({ isSelected: false });
  const handleClck = (value: Node, e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick(e, value);
  };

  const init = () => {
    const subscription = action$
      .pipe(
        Rx.filter(
          (value) =>
            value.type === FolderEvent.SELECTED ||
            value.type === FolderEvent.DESELECT
        )
      )
      .subscribe((value) => {
        const isSelected = FolderEvent.SELECTED
          ? value.data.some((v: Node) => v.id === node.id)
          : false;
        setState((state) => ({ ...state, isSelected }));
      });
    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);

  return (
    <div
      id={node.id.toString()}
      className={clsx(
        styles.item,
        'sortable--item',
        node.isDirectory() ? styles.directory : styles.file,
        { [styles['is-selected']]: state.isSelected }
      )}
      onClick={handleClck.bind(null, node)}
      {...(node.isDirectory()
        ? {}
        : { 'data-extension': (node as any).extension() })}
    >
      <span>{node.subject}</span>
    </div>
  );
});

type ListType = {
  items: Node[];
  className?: string;
};
const List = SortableContainer(({ items = [], ...rest }: ListType) => {
  return (
    <div className={styles.container}>
      {items.map((item, index: number) => (
        <Item key={item.id} index={index} node={item} {...rest} />
      ))}
    </div>
  );
}) as any;

export default (props: any) => {
  const { onChanged = () => {}, ...rest } = props;
  const handleChanged = ({ oldIndex, newIndex }: any) => {
    onChanged([oldIndex, newIndex]);
    Array.from(document.querySelectorAll('body > .sortable--item')).forEach(
      (el) => {
        el.parentNode?.removeChild(el);
      }
    );
  };
  return <List axis="xy" distance={1} {...props} onSortEnd={handleChanged} />;
};
