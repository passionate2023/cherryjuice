import { ac_ } from '::store/store';
import { router } from '::root/router/router';

const handleFetchError = ({ userId }) => {
  if (!userId) {
    router.goto.signIn();
    return [ac_.root.resetState];
  } else return [ac_.document.fetchFailed];
};

export { handleFetchError };
