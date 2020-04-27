const openConsentWindow = ({ url, onAuth }) => () => {
  window.open(
    url,
    '',
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no',
  );
  window.addEventListener('message', e => {
    if (e?.data?.token) {
      onAuth(e.data);
    }
  });
};

export { openConsentWindow };
