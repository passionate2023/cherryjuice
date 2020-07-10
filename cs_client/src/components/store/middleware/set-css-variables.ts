import { cssVariables } from '::assets/styles/css-variables/set-css-variables';

const setCssVariables = () => next => action => {
  if (action.type.startsWith('css-variables')) {
    const variableName = action.type.replace('css-variables::set-', '');
    cssVariables.setProperty(variableName)(action.payload);
  }
  return next(action);
};

export { setCssVariables };
