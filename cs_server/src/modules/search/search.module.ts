import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { NodeModule } from '../node/node.module';

@Module({
  imports: [NodeModule],
  providers: [SearchService, SearchResolver],
  exports: [SearchService],
})
export class SearchModule {}
