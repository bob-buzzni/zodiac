import styles from './SortableList.module.css';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Node } from '~/utils/storage';
import clsx from 'clsx';
type ItemType = {
  value: Node;
  onClick: (item: any) => void;
};
const Item: any = SortableElement(({ value, onClick = () => {} }: ItemType) => (
  <div
    className={clsx(
      styles.item,
      value.isDirectory() ? styles.directory : styles.file,
      'sortable--item'
    )}
    onClick={onClick.bind(null, value)}
    {...(value.isDirectory() ? {} : { 'data-extension': (value as any).extension() })}
  >
    <span>{value.subject}</span>
  </div>
));

type ListType = {
  items: Node[];
  className?: string;
};
const List = SortableContainer(({ items = [], ...rest }: ListType) => {
  return (
    <div className={styles.container}>
      {items.map((item, index: number) => (
        <Item key={item.id} index={index} value={item} {...rest} />
      ))}
    </div>
  );
}) as any;

export default (props: any) => {
  const { onChanged = () => {}, ...rest } = props;
  const handleChanged = ({ oldIndex, newIndex }: any) => {
    onChanged([oldIndex, newIndex]);
  };
  return <List axis="xy" distance={1} {...props} onSortEnd={handleChanged} />;
};
