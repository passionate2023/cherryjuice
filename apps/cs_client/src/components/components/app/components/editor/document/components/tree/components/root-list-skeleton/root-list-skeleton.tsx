import React from 'react';
import ContentLoader from 'react-content-loader';
import mod from './root-list-skeleton.scss';
import { SkeletonWrapper } from '::shared-components/loading-indicator/skeleton-wrapper';

export const RootListSkeleton = () => {
  return (
    <SkeletonWrapper className={mod.rootListSkeleton}>
      {props => (
        <ContentLoader
          speed={2}
          width={177}
          height={248}
          viewBox="0 0 177 248"
          {...props}
        >
          <path d="M 0 0 h 177 v 20 H 0 z M 0 38 h 142 v 20 H 0 z M 0 76 h 155 v 20 H 0 z M 0 114 h 92 v 20 H 0 z M 0 152 h 109 v 20 H 0 z M 0 190 h 84 v 20 H 0 z M 0 228 h 109 v 20 H 0 z" />
        </ContentLoader>
      )}
    </SkeletonWrapper>
  );
};
