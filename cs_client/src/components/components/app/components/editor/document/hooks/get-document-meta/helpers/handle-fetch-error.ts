import { ac_ } from '::store/store';

const handleFetchError = () => [ac_.document.fetchFailed];

export { handleFetchError };
