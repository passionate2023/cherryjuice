import * as React from 'react';
import { TDispatchAppReducer } from '::types/react';
import { appActions } from '::app/reducer';

class ErrorBoundary extends React.Component<
  { dispatch: TDispatchAppReducer },
  { error?: Error }
> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error) {
    this.props.dispatch({
      type: appActions.SET_ERROR,
      value: error,
    });
    // You can also log the error to an error reporting service
    // console.log('componentDidCatch', { error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return '';
    }
    return this.props.children;
  }
}
export { ErrorBoundary };
