const path = require('path');
module.exports = {
  '::sass-modules': path.resolve(__dirname, '../src/assets/styles/modules/'),
  '::types': path.resolve(__dirname, '../types/'),
  '::helpers': path.resolve(__dirname, '../src/helpers/'),
  '::graphql': path.resolve(__dirname, '../src/graphql/'),
  '::assets': path.resolve(__dirname, '../src/assets/'),
  '::shared-components': path.resolve(
    __dirname,
    '../src/components/components/shared-components/',
  ),
  '::hooks': path.resolve(__dirname, '../src/hooks/'),
  '::app': path.resolve(__dirname, '../src/components/components/app/'),
  '::editor': path.resolve(__dirname, '../src/components/components/editor/'),
  '::auth': path.resolve(__dirname, '../src/components/components/auth/'),
  '::root': path.resolve(__dirname, '../src/components/'),
  '::store': path.resolve(__dirname, '../src/store/'),
  '::cypress': path.resolve(__dirname, '../cypress/'),
};
