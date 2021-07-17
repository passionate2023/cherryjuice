import { calculateEditedAttribute, EditNodesProps } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/calculate-edited-attributes/calculate-edited-attributes';
import { generateNode } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node/helpers/generate-node';
import { nodeMetaInitialState } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { MutateNodeData } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import { NodePrivacy } from '@cherryjuice/graphql-types';

const nodeA = generateNode({
  documentId: 'doc1',
  father_id: 0,
  highestNode_id: 0,
  fatherId: 'node-0',
  nodeBMeta: { ...nodeMetaInitialState },
});
const testsData: {
  input: EditNodesProps;
  output: MutateNodeData;
  name: string;
}[] = [
  {
    name: 'set node name',
    input: {
      nodeA: { ...nodeA },
      nodeBMeta: {
        ...nodeMetaInitialState,
        name: 'one',
      },
    },
    output: { name: 'one' },
  },
  {
    name: 'change node name',
    input: {
      nodeA: { ...nodeA, name: 'one' },
      nodeBMeta: {
        ...nodeMetaInitialState,
        name: 'two',
      },
    },
    output: {
      name: 'two',
    },
  },
  {
    name: 'set node color',
    input: {
      nodeA: { ...nodeA, name: 'one' },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        name: 'one',
      },
    },
    output: {
      node_title_styles: JSON.stringify({ color: '#ff0000' }),
    },
  },
  {
    name: 'no change',
    input: {
      nodeA: {
        ...nodeA,
        name: 'one',
        node_title_styles: JSON.stringify({ color: '#ff0000' }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        name: 'one',
        customColor: '#ff0000',
      },
    },
    output: {},
  },
  {
    name: 'set node bold',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({ color: '#ff0000' }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
      },
    },
    output: {
      node_title_styles: JSON.stringify({
        color: '#ff0000',
        fontWeight: 'bold',
      }),
    },
  },
  {
    name: 'remove node bold',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
        }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: false,
      },
    },
    output: {
      node_title_styles: JSON.stringify({ color: '#ff0000' }),
    },
  },
  {
    name: 'set node icon',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
        }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
      },
    },
    output: {
      node_title_styles: JSON.stringify({
        color: '#ff0000',
        fontWeight: 'bold',
        icon_id: 3,
      }),
    },
  },
  {
    name: 'no change in color/weight/icon',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
      },
    },
    output: {},
  },
  {
    name: 'remove node icon',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 0,
      },
    },
    output: {
      node_title_styles: JSON.stringify({
        color: '#ff0000',
        fontWeight: 'bold',
      }),
    },
  },
  {
    name: 'clear node style',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ffffff',
        isBold: false,
        customIcon: 0,
      },
    },
    output: {
      node_title_styles: undefined,
    },
  },
  {
    name: 'set node privacy',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
        privacy: NodePrivacy.GUESTS_ONLY,
      },
    },
    output: {
      privacy: NodePrivacy.GUESTS_ONLY,
    },
  },
  {
    name: 'no change in style/privacy',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
        privacy: NodePrivacy.GUESTS_ONLY,
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
        privacy: NodePrivacy.GUESTS_ONLY,
      },
    },
    output: {},
  },
  {
    name: 'remove node privacy',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
        privacy: NodePrivacy.GUESTS_ONLY,
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
        privacy: NodePrivacy.DEFAULT,
      },
    },
    output: {
      privacy: NodePrivacy.DEFAULT,
    },
  },
  {
    name: 'set node tag',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
        privacy: NodePrivacy.GUESTS_ONLY,
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
        privacy: NodePrivacy.GUESTS_ONLY,
        tags: ['react', 'angular'],
      },
    },
    output: {
      tags: 'react, angular',
    },
  },
  {
    name: 'no changes in style/privacy/tags',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
        privacy: NodePrivacy.GUESTS_ONLY,
        tags: 'react, angular',
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
        privacy: NodePrivacy.GUESTS_ONLY,
        tags: ['react', 'angular'],
      },
    },
    output: {},
  },
  {
    name: 'remove node tag',
    input: {
      nodeA: {
        ...nodeA,
        node_title_styles: JSON.stringify({
          color: '#ff0000',
          fontWeight: 'bold',
          icon_id: 3,
        }),
        privacy: NodePrivacy.GUESTS_ONLY,
        tags: 'react, angular',
      },
      nodeBMeta: {
        ...nodeMetaInitialState,
        customColor: '#ff0000',
        isBold: true,
        customIcon: 3,
        privacy: NodePrivacy.GUESTS_ONLY,
        tags: [],
      },
    },
    output: {
      tags: '',
    },
  },
];
// passes locally but fails in github-actions
// ReferenceError: _interopRequireDefault is not defined
// https://github.com/swc-project/swc/issues/1554
describe.skip('calculate edited attributes', function () {
  testsData.forEach(({ input, output, name }) => {
    it(name, () => {
      const changes = calculateEditedAttribute(input);
      expect(changes).toEqual(output);
    });
  });
});
