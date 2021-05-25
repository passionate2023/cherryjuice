import { useSelector } from 'react-redux';
import { Store } from '::store/store';
import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';

type ApplyEditorSettingsProps = {};

const useApplyEditorSettings = () => {
  const editorSettings = useSelector((state: Store) => state.editorSettings);
  useEffect(() => {
    Object.entries(editorSettings.current).forEach(([key, value]) => {
      if (key !== 'version') {
        cssVariables.setVariable(key, value);
      }
    });
  }, [editorSettings]);
};

export { useApplyEditorSettings };
