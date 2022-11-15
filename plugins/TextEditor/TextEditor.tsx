import { useRef, useState, FormEvent, useEffect } from 'react';
import { Node } from '~/utils/storage';
import styles from './TextEditor.module.css';
import * as Rx from 'rxjs';
import axios from 'axios';
function TextEditor({ args }: any) {
  const node = args as Node;

  const [subject] = useState(new Rx.Subject<FormEvent<HTMLTextAreaElement>>());
  const [content, setContent] = useState<string | null>(null);

  const handleChanged = (e: FormEvent<HTMLTextAreaElement>) => {
    subject.next(e);
  };

  const update = (value: string) => {
    axios.put(`/api/storage/${node.id}`, {
      content: value,
    });
  };

  const init = () => {
    axios
      .get(`/api/storage/${node.id}`)
      .then((res) => res.data)
      .then((res) => setContent(res.content));

    const subscription = subject
      .pipe(
        Rx.map((v) => v.currentTarget.value),
        Rx.debounceTime(1500)
      )
      .subscribe(update);
    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);
  return (
    <div className={styles.container}>
      {!!content ? (
        <textarea
          className={styles.textarea}
          name="content"
          defaultValue={content}
          onInput={handleChanged}
        ></textarea>
      ) : null}
    </div>
  );
}
export default TextEditor;
