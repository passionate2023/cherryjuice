import { ApolloClient } from 'apollo-client';
type CacheState = {
  cache: any;
  client: ApolloClient<any>;
  modifications: {
    document: {
      created: {
        [documentId: string]: boolean;
      };
    };
    node: {
      deleted: {
        [nodeId: string]: 'soft' | 'hard';
      };

      meta: {
        [nodeId: string]: {
          child_nodes?: boolean;
          fatherId?: boolean;
          father_id?: number;
          icon_id?: boolean;
          is_richtxt?: boolean;
          name?: boolean;
          node_title_styles?: boolean;
          position?: boolean;
          read_only?: number;
          sequence?: boolean;
        };
      };
      created: {
        [nodeId: string]: boolean;
      };
      content: {
        [nodeId: string]: {
          html?: boolean;
          'image({"thumbnail":true})'?: boolean;
          'image({"thumbnail":false})'?: boolean;
        };
      };
    };
    image: {
      deleted: {
        [nodeId: string]: string[];
      };
      created: {
        [nodeId: string]: {
          base64: string[];
          url: string[];
        };
      };
    };
  };
};
const cacheInitialState: CacheState = {
  cache: undefined,
  client: undefined,
  modifications: {
    document: {
      created: {},
    },
    node: {
      deleted: {},
      meta: {},
      created: {},
      content: {},
    },
    image: {
      deleted: {},
      created: {},
    },
  },
};
export { cacheInitialState };
export { CacheState };
