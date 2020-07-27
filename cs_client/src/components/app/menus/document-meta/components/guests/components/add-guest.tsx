import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { modGuests, modTextInput } from '::sass-modules/';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { patterns } from '::auth/helpers/form-validation';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { USER_EXISTS } from '::graphql/queries/user-exists';
import { documentMetaActionCreators } from '::app/menus/document-meta/reducer/reducer';
import { AccessLevel } from '::types/graphql/generated';
import { AlertType } from '::types/react';
import { ac } from '::root/store/store';

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
          } else
            documentMetaActionCreators.addGuest({
              accessLevel: AccessLevel.READER,
              email,
              userId: guestUserId,
            });
        } else {
          ac.dialogs.setAlert({
            type: AlertType.Neutral,
            title: 'user does not exist',
            description: 'try a different email',
          });
        }
      });
    }
  }, []);

  const pattern = patterns.email;
  return (
    <div className={modGuests.guests__addGuest}>
      <div className={modGuests.guests__addGuest__inputs}>
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
        />
        <ButtonSquare
          text={'add guest'}
          className={modGuests.guests__addGuest__addButton}
          onClick={addGuestM}
          disabled={!inputRef.current?.checkValidity() || !inputValue}
        />
      </div>
    </div>
  );
};

export { AddGuest };
