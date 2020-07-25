import { Privacy } from '../../../../document/entities/document.entity';
import { QueryCreatorState } from './time-filter';
import { andGroup, orGroup } from './clause-builder';

type OwnershipProps = {
  state: QueryCreatorState;
  userId: string;
};
const ownershipWC = ({ userId, state }: OwnershipProps): string =>
  orGroup('ownership')
    .or(
      andGroup('public users')
        .tap(() => state.variables.push(Privacy.PUBLIC))
        .and(`d.privacy >= $${state.variables.length}`)
        .and(
          orGroup()
            .or('n.privacy isnull')
            .or(`n.privacy >= $${state.variables.length}`),
        ),
    )
    .orIf(
      Boolean(userId),
      orGroup('auth users')
        .tap(() => {
          if (userId) return state.variables.push(userId);
        })
        .or(`d."userId" = $${state.variables.length}`)
        .or(
          andGroup('guest users')
            .and(`g."userId" = $${state.variables.length}`)
            .and(`g."documentId" = d.id`)
            .tap(() => {
              if (userId) state.variables.push(Privacy.GUESTS_ONLY);
            })
            .and(`d."privacy" >= $${state.variables.length}`)
            .and(
              orGroup()
                .or('n.privacy isnull')
                .or(`n.privacy >= $${state.variables.length}`),
            ),
        ),
    )
    .get();

export { ownershipWC };
