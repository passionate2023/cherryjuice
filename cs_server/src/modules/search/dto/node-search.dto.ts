import { NodeSearchIt } from '../it/node-search.it';
import { User } from '../../user/entities/user.entity';

export class NodeSearchDto {
  user: User;
  it: NodeSearchIt;
}
