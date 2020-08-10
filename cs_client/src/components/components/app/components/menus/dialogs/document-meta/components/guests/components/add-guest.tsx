import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { modGuests, modNodeMeta, modTextInput } from '::sass-modules';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { USER_EXISTS } from '::graphql/queries/user-exists';
import { documentMetaActionCreators } from '::root/components/app/components/menus/dialogs/document-meta/reducer/reducer';
import { AccessLevel } from '::types/graphql/generated';
import { AlertType } from '::types/react';
import { ac } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';

const useTextInput: () => [string, (e) => void] = () => {
  const [inputValue, setInputValue] = useState('');
  const setInputValueM = useCallback(e => {
    setInputValue(e.target.value);
  }, []);

  return [inputValue, setInputValueM];
};

type Props = {
  userId: string;
};

const AddGuest: React.FC<Props> = ({ userId }) => {
  const [inputValue, setInputValue] = useTextInput();
  const inputRef = useRef<HTMLInputElement>();
  const addGuestM = useCallback(() => {
    if (inputRef.current.checkValidity()) {
      const email = inputRef.current.value;
      apolloCache.client.mutate(USER_EXISTS({ email })).then(guestUserId => {
        if (guestUserId) {
          if (guestUserId === userId) {
            ac.dialogs.setAlert({
              type: AlertType.Neutral,
              title: "you can't add yourself as a guest",
              description: 'try a different email',
            });
          } else {
            documentMetaActionCreators.addGuest({
              accessLevel: AccessLevel.READER,
              email,
              userId: guestUserId,
            });
            setInputValue({ target: { value: '' } });
          }
        } else {
          ac.dialogs.setAlert({
            type: AlertType.Neutral,
            title: 'user does not exist',
            description: 'try a different email',
          });
        }
      });
    }
  }, [userId]);

  const pattern = patterns.email;
  return (
    <div className={modGuests.guests__addGuest}>
      <div className={modGuests.guests__addGuest__inputs}>
        <span className={modNodeMeta.nodeMeta__input__label}>guests</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          type="text"
          pattern={pattern.pattern}
          className={joinClassNames([
            modGuests.guests__addGuest__input,
            modTextInput.textInput,
          ])}
          placeholder={'email'}
          data-testid={testIds.documentMeta__addGuest__input}
        />
        <ButtonSquare
          text={'add guest'}
          className={modGuests.guests__addGuest__addButton}
          onClick={addGuestM}
          disabled={!inputRef.current?.checkValidity() || !inputValue}
          testId={testIds.documentMeta__addGuest__addButton}
        />
      </div>
    </div>
  );
};

export { AddGuest };
