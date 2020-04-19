import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';

class ErrorBoundary extends React.Component<{}, { error?: Error }> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error) {
    appActionCreators.setAlert({
      title: 'Some thing went wrong',
      description: 'Please refresh the page',
      type: AlertType.Error,
      error,
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
