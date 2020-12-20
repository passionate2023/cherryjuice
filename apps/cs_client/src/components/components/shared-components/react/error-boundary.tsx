import * as React from 'react';
import { AlertType } from '::types/react';
import { ac } from '::store/store';

class ErrorBoundary extends React.PureComponent<{}, { error?: Error }> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error) {
    ac.dialogs.setAlert({
      title: 'Something went wrong',
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
