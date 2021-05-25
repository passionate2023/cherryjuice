import React from 'react';
import ContentLoader from 'react-content-loader';
import { SkeletonWrapper } from '::shared-components/loading-indicator/skeleton-wrapper';
import mod from './documents-list-skeleton.scss';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const MbOrTb = props => (
  <ContentLoader
    speed={2}
    width={250}
    height={569}
    viewBox="0 0 250 569"
    {...props}
  >
    <path d="M 0 0 h 143 v 17 H 0 z M 0 46 h 195 v 17 H 0 z M 0 92 h 187 v 17 H 0 z M 0 138 h 155 v 17 H 0 z M 0 184 h 172 v 17 H 0 z M 0 230 h 164 v 17 H 0 z M 0 276 h 153 v 17 H 0 z M 0 322 h 172 v 17 H 0 z M 0 368 h 200 v 17 H 0 z M 0 414 h 165 v 17 H 0 z M 0 460 h 181 v 17 H 0 z M 0 506 h 189 v 17 H 0 z M 0 552 h 177 v 17 H 0 z" />
  </ContentLoader>
);
const Wd = props => (
  <ContentLoader
    speed={2}
    width={1242}
    height={615}
    viewBox="0 0 1242 615"
    {...props}
  >
    <path d="M 0 0 h 143 v 17 H 0 z M 865 0 h 106 v 17 H 865 z M 1006 0 h 106 v 17 h -106 z M 1136 0 h 106 v 17 h -106 z M 0 46 h 195 v 17 H 0 z M 865 46 h 106 v 17 H 865 z M 1006 46 h 106 v 17 h -106 z M 1136 46 h 106 v 17 h -106 z M 0 92 h 187 v 17 H 0 z M 865 92 h 106 v 17 H 865 z M 1006 92 h 106 v 17 h -106 z M 1136 92 h 106 v 17 h -106 z M 0 138 h 155 v 17 H 0 z M 865 138 h 106 v 17 H 865 z M 1006 138 h 106 v 17 h -106 z M 1136 138 h 106 v 17 h -106 z M 0 184 h 172 v 17 H 0 z M 865 184 h 106 v 17 H 865 z M 1006 184 h 106 v 17 h -106 z M 1136 184 h 106 v 17 h -106 z M 0 230 h 164 v 17 H 0 z M 865 230 h 106 v 17 H 865 z M 1006 230 h 106 v 17 h -106 z M 1136 230 h 106 v 17 h -106 z M 0 276 h 172 v 17 H 0 z M 865 276 h 106 v 17 H 865 z M 1006 276 h 106 v 17 h -106 z M 1136 276 h 106 v 17 h -106 z M 0 322 h 153 v 17 H 0 z M 865 322 h 106 v 17 H 865 z M 1006 322 h 106 v 17 h -106 z M 1136 322 h 106 v 17 h -106 z M 0 368 h 172 v 17 H 0 z M 865 368 h 106 v 17 H 865 z M 1006 368 h 106 v 17 h -106 z M 1136 368 h 106 v 17 h -106 z M 0 414 h 200 v 17 H 0 z M 865 414 h 106 v 17 H 865 z M 1006 414 h 106 v 17 h -106 z M 1136 414 h 106 v 17 h -106 z M 0 460 h 165 v 17 H 0 z M 865 460 h 106 v 17 H 865 z M 1006 460 h 106 v 17 h -106 z M 1136 460 h 106 v 17 h -106 z M 0 506 h 181 v 17 H 0 z M 865 506 h 106 v 17 H 865 z M 1006 506 h 106 v 17 h -106 z M 1136 506 h 106 v 17 h -106 z M 0 552 h 189 v 17 H 0 z M 865 552 h 106 v 17 H 865 z M 1006 552 h 106 v 17 h -106 z M 1136 552 h 106 v 17 h -106 z M 0 598 h 177 v 17 H 0 z M 865 598 h 106 v 17 H 865 z M 1006 598 h 106 v 17 h -106 z M 1136 598 h 106 v 17 h -106 z" />
  </ContentLoader>
);
const Md = props => (
  <ContentLoader
    speed={2}
    width={841}
    height={615}
    viewBox="0 0 841 615"
    {...props}
  >
    <path d="M 0 0 h 143 v 17 H 0 z M 464 0 h 106 v 17 H 464 z M 605 0 h 106 v 17 H 605 z M 735 0 h 106 v 17 H 735 z M 0 46 h 195 v 17 H 0 z M 464 46 h 106 v 17 H 464 z M 605 46 h 106 v 17 H 605 z M 735 46 h 106 v 17 H 735 z M 0 92 h 187 v 17 H 0 z M 464 92 h 106 v 17 H 464 z M 605 92 h 106 v 17 H 605 z M 735 92 h 106 v 17 H 735 z M 0 138 h 155 v 17 H 0 z M 464 138 h 106 v 17 H 464 z M 605 138 h 106 v 17 H 605 z M 735 138 h 106 v 17 H 735 z M 0 184 h 172 v 17 H 0 z M 464 184 h 106 v 17 H 464 z M 605 184 h 106 v 17 H 605 z M 735 184 h 106 v 17 H 735 z M 0 230 h 164 v 17 H 0 z M 464 230 h 106 v 17 H 464 z M 605 230 h 106 v 17 H 605 z M 735 230 h 106 v 17 H 735 z M 0 276 h 172 v 17 H 0 z M 464 276 h 106 v 17 H 464 z M 605 276 h 106 v 17 H 605 z M 735 276 h 106 v 17 H 735 z M 0 322 h 153 v 17 H 0 z M 464 322 h 106 v 17 H 464 z M 605 322 h 106 v 17 H 605 z M 735 322 h 106 v 17 H 735 z M 0 368 h 172 v 17 H 0 z M 464 368 h 106 v 17 H 464 z M 605 368 h 106 v 17 H 605 z M 735 368 h 106 v 17 H 735 z M 0 414 h 200 v 17 H 0 z M 464 414 h 106 v 17 H 464 z M 605 414 h 106 v 17 H 605 z M 735 414 h 106 v 17 H 735 z M 0 460 h 165 v 17 H 0 z M 464 460 h 106 v 17 H 464 z M 605 460 h 106 v 17 H 605 z M 735 460 h 106 v 17 H 735 z M 0 506 h 181 v 17 H 0 z M 464 506 h 106 v 17 H 464 z M 605 506 h 106 v 17 H 605 z M 735 506 h 106 v 17 H 735 z M 0 552 h 189 v 17 H 0 z M 464 552 h 106 v 17 H 464 z M 605 552 h 106 v 17 H 605 z M 735 552 h 106 v 17 H 735 z M 0 598 h 177 v 17 H 0 z M 464 598 h 106 v 17 H 464 z M 605 598 h 106 v 17 H 605 z M 735 598 h 106 v 17 H 735 z" />
  </ContentLoader>
);
const skelerons = {
  wd: Wd,
  mb: MbOrTb,
  tb: MbOrTb,
  md: Md,
};

export const DocumentsListSkeleton: React.FC = () => {
  const breakpoint = useCurrentBreakpoint();
  return (
    <SkeletonWrapper className={mod.documentsListSkeleton}>
      {props => skelerons[breakpoint.current]?.(props)}
    </SkeletonWrapper>
  );
};
