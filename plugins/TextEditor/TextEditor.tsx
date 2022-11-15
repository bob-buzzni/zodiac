import { FormEvent, useEffect, useState } from 'react';
import * as Rx from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Node } from '~/utils/storage';
import styles from './TextEditor.module.css';
function TextEditor({ args }: any) {
  const node = args as Node;

  const [subject] = useState(new Rx.Subject<FormEvent<HTMLTextAreaElement>>());
  const [content, setContent] = useState<string | null>(null);

  const init = () => {
    const subscription = new Rx.Subscription();
    subscription.add(
      fromFetch(`/api/storage/${node.id}`, {
        selector: (response) => response.json(),
      })
        .pipe(Rx.map((value) => value.content))
        .subscribe(setContent)
    );

    const fetch$ = subject
      .pipe(
        Rx.map((v) => v.currentTarget.value),
        Rx.debounceTime(1500),
        Rx.switchMap((value) =>
          fromFetch(`/api/storage/${node.id}`, {
            method: 'put',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ content: value }),
            selector: (response) => response.json(),
          }).pipe(Rx.map((value) => value.content))
        )
      )
      .subscribe(setContent);

    subscription.add(fetch$);
    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);
  return (
    <div className={styles.container}>
      {content === null ? null : (
        <textarea
          className={styles.textarea}
          name="content"
          defaultValue={content}
          onInput={(e) => subject.next(e)}
        ></textarea>
      )}
    </div>
  );
}
export default TextEditor;
