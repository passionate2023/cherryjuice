import { cssVariables } from '::assets/styles/css-variables/set-css-variables';

const setCssVariables = () => next => action => {
  try {
    if (action?.type?.startsWith('css-variables')) {
      const variableName = action.type.replace('css-variables::set-', '');
      cssVariables.setProperty(variableName)(action.payload);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
  }
  return next(action);
};

export { setCssVariables };
