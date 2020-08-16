import { Privacy } from '../../../../document/entities/document.entity';
import { QueryCreatorState } from './time-filter';
import { and_, or_ } from './clause-builder';

type OwnershipProps = {
  state: QueryCreatorState;
  userId: string;
};
const ownershipWC = ({ userId, state }: OwnershipProps): string =>
  or_('ownership')
    .or(
      and_('public users')
        .tap(() => state.variables.push(Privacy.PUBLIC))
        .and(`d.privacy >= $${state.variables.length}`)
        .and(
          or_()
            .or('n.privacy isnull')
            .or(
              `n.privacy::text::document_privacy_enum >= $${state.variables.length}`,
            ),
        ),
    )
    .orIf(
      Boolean(userId),
      or_('auth users')
        .tap(() => {
          if (userId) state.variables.push(userId);
        })
        .or(`d."userId" = $${state.variables.length}`)
        .or(
          and_('guest users')
            .and(`g."userId" = $${state.variables.length}`)
            .and(`g."documentId" = d.id`)
            .tap(() => {
              if (userId) state.variables.push(Privacy.GUESTS_ONLY);
            })
            .and(`d."privacy" >= $${state.variables.length}`)
            .and(
              or_()
                .or('n.privacy isnull')
                .or(
                  `n.privacy::text::document_privacy_enum >= $${state.variables.length}`,
                ),
            ),
        ),
    )
    ._();

export { ownershipWC };
