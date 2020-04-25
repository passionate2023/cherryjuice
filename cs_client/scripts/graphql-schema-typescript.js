const { generateTypeScriptTypes } = require('graphql-schema-typescript');
const fs = require('fs');
const path = require('path');
const schema = fs.readFileSync('../schema.graphql', 'utf8');

generateTypeScriptTypes(
  schema,
  path.resolve(__dirname, '../types/graphql/generated.ts'),
  { typePrefix: '' },
)
  .then(() => {
    console.log('DONE');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
