import { Injectable } from '@nestjs/common';
import { NodeSearchDto } from './dto/node-search.dto';
import { NodeSearchResultEntity } from './entities/node.search-result.entity';
import { NodeService } from '../node/node.service';

@Injectable()
export class SearchService {
  constructor(private nodeService: NodeService) {}
  async nodeSearch(args: NodeSearchDto): Promise<NodeSearchResultEntity[]> {
    return this.nodeService.findNode(args);
  }
}
