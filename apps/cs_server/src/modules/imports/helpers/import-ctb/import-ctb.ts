import imageThumbnail from 'image-thumbnail';
import { Node } from '../../../node/entities/node.entity';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from '../../../document/entities/document.entity';
import { Image } from '../../../image/entities/image.entity';
import {
  ImageSqliteRepository,
  SqliteImage,
} from './repositories/image.sqlite.repository';
import {
  nodeTitleHelpers,
  nodeTitleStyle,
} from './rendering/node-meta/node-title-style';
import { FileMeta } from '../download/create-dowload-task/create-gdrive-download-task';
import { User } from '../../../user/entities/user.entity';
import { CreateNodeDTO } from '../../../node/dto/mutate-node.dto';
import { convertTime } from './rendering/node-meta/convert-time';
import { SqliteNodeMeta } from './repositories/queries/node';
import { AHtmlLine } from '@cherryjuice/ahtml-to-html';

type SqliteNodeMetaPreProcessed = SqliteNodeMeta & {
  child_nodes: number[];
  is_empty: number;
  node_title_styles: string;
};
export type NodeDateMap = Map<number, { createdAt: Date; updatedAt: Date }>;
export type NodeDatesMap = NodeDateMap;
type SqliteNodeNode_idMap = Map<number, SqliteNodeMetaPreProcessed>;
type NodeNode_idMap = Map<number, Node>;

export const createSortBySequence = (
  rawNodesMap: Map<number, { sequence: number }>,
) => (a: number, b: number) =>
  rawNodesMap.get(a).sequence - rawNodesMap.get(b).sequence;

type NodeImagesMap = [Node, { png: Buffer; hash?: string }[]][];

type Node_idImagesMap = Map<number, string[]>;

type NodeCreator = (dto: CreateNodeDTO) => Promise<Node>;

type ImageGetter = (node: { node_id: number }) => Promise<SqliteImage[]>;

export class ImportCTB {
  private readonly documentSqliteRepository: DocumentSqliteRepository;
  private readonly nodeSqliteRepository: NodeSqliteRepository;
  private readonly imageSqliteRepository: ImageSqliteRepository;
  constructor(private nodeCreator: NodeCreator, private user: User) {
    this.documentSqliteRepository = new DocumentSqliteRepository();
    this.nodeSqliteRepository = new NodeSqliteRepository(
      this.documentSqliteRepository,
    );
    this.imageSqliteRepository = new ImageSqliteRepository(
      this.documentSqliteRepository,
    );
  }

  async saveDocument({
    document,
    fileMeta,
  }: {
    document: Document;
    fileMeta: FileMeta;
  }): Promise<void> {
    await this.documentSqliteRepository.openDB(fileMeta.location.path);
    const nodesARaw = await this.nodeSqliteRepository.getNodesMeta();

    const nodesA: SqliteNodeNode_idMap = new Map(
      nodesARaw.map(node => [
        node.node_id,
        {
          ...node,
          read_only: nodeTitleHelpers.isReadOnly(+node.read_only),
          child_nodes: [],
          is_empty: 0,
          createdAt: convertTime(node.createdAt),
          updatedAt: convertTime(node.updatedAt),
          node_title_styles: nodeTitleStyle({
            is_richtxt: node.is_richtxt,
            is_ro: +node.read_only,
          }),
        },
      ]),
    );
    const {
      nodeImagesMap,
      nodesMap,
      nodeDatesMap,
      bookmarks,
    } = await ImportCTB.saveNodesMeta(
      document,
      nodesA,
      this.nodeCreator,
      node => this.imageSqliteRepository.getNodeImages(node),
      this.user.id,
    );

    document.state.bookmarks = bookmarks
      .sort((a, b) => a[1] - b[1])
      .map(([node_id]) => node_id);
    await ImportCTB.addChildToParents(nodesA, nodesMap);
    const { node_idImagesMap } = await ImportCTB.saveImages(nodeImagesMap);
    await ImportCTB.saveAhtml({
      node_idImagesMap,
      nodesMap,
      nodeDatesMap,
      document,
      aHtmlGetter: (node_id, imageIds) =>
        this.nodeSqliteRepository.getAHtml(node_id, imageIds),
    });
    await this.documentSqliteRepository.closeDB();
  }

  static async saveNodesMeta(
    documentB: Document,
    nodesA: SqliteNodeNode_idMap,
    nodeCreator: NodeCreator,
    imageGetter: ImageGetter,
    userId: string,
  ): Promise<{
    nodesMap: NodeNode_idMap;
    nodeImagesMap: NodeImagesMap;
    nodeDatesMap: NodeDateMap;
    bookmarks: [number, number][];
  }> {
    const nodeImagesMap: NodeImagesMap = [];
    const nodesMap = new Map<number, Node>();
    const nodeDatesMap: NodeDatesMap = new Map();
    const bookmarks: [number, number][] = [];
    for (const nodeA of nodesA.values()) {
      const parentNode = nodesA.get(nodeA.father_id);
      if (parentNode) {
        parentNode.child_nodes.push(nodeA.node_id);
      }

      const dto: CreateNodeDTO = {
        getNodeDTO: {
          documentId: documentB.id,
          node_id: nodeA.node_id,
          userId,
        },
        data: {
          father_id: nodeA.father_id,
          child_nodes: nodeA.child_nodes,
          name: nodeA.name,
          node_id: nodeA.node_id,
          node_title_styles: nodeA.node_title_styles,
          privacy: undefined,
          read_only: nodeA.read_only,
          createdAt: 0,
          updatedAt: 0,
          fatherId: undefined,
        },
      };
      const nodeB = await nodeCreator(dto);
      nodesMap.set(nodeB.node_id, nodeB);
      nodeDatesMap.set(nodeB.node_id, {
        createdAt: new Date(nodeA.createdAt),
        updatedAt: new Date(nodeA.updatedAt),
      });
      if (nodeA.has_image) {
        const images = await imageGetter({
          node_id: nodeB.node_id,
        });
        nodeImagesMap.push([nodeB, images]);
      }
      if (nodeA.bookmark)
        bookmarks.push([nodeA.bookmark, nodeA.bookmark_sequence]);
    }

    return { nodeImagesMap, nodesMap, nodeDatesMap, bookmarks };
  }

  static addChildToParents = (
    nodesToSave: SqliteNodeNode_idMap,
    savedNodes: NodeNode_idMap,
  ) => {
    const sortBySequence = createSortBySequence(nodesToSave);
    for (const node of Array.from(savedNodes.values())) {
      node.child_nodes.sort(sortBySequence);
      const father = savedNodes.get(node.father_id);
      if (father) node.father = father;
    }
  };

  static async saveImages(
    nodeImagesMap: NodeImagesMap,
  ): Promise<{ node_idImagesMap: Node_idImagesMap }> {
    const node_idImagesMap: Node_idImagesMap = new Map();
    for (const [node, images] of nodeImagesMap) {
      const imageIds = [];
      for (const { png, hash } of images) {
        if (png) {
          const image = new Image();
          image.image = png;
          image.thumbnail = await imageThumbnail(png, {
            percentage: 5,
          });
          image.nodeId = node.id;
          image.documentId = node.documentId;
          image.hash = hash;
          await image.save();
          imageIds.push(image.id);
        }
      }
      node_idImagesMap.set(node.node_id, imageIds);
    }
    return { node_idImagesMap };
  }

  static async saveAhtml({
    nodesMap,
    node_idImagesMap,
    nodeDatesMap,
    document,
    aHtmlGetter,
  }: {
    nodesMap: NodeNode_idMap;
    node_idImagesMap: Node_idImagesMap;
    nodeDatesMap: NodeDatesMap;
    document: Document;
    aHtmlGetter: (node_id: string, imageIds?: string[]) => Promise<AHtmlLine[]>;
  }) {
    for (const node of Array.from(nodesMap.values())) {
      const node_id = String(node.node_id);
      const imagesIds = node_idImagesMap.get(node.node_id);
      const ahtml = await aHtmlGetter(node_id, imagesIds);
      node.ahtml = JSON.stringify(ahtml);
      node.updateAhtmlTxt();
      node.createdAt = nodeDatesMap.get(node.node_id).createdAt;
      node.updatedAt = nodeDatesMap.get(node.node_id).updatedAt;
      node.updateSha();
      document.nodes[node.node_id] = { hash: node.hash };
      await node.save();
    }
  }
}
