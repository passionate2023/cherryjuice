import React from 'react';
import ContentLoader from 'react-content-loader';
import mod from './editor-skeleton.scss';
import { SkeletonWrapper } from '::shared-components/loading-indicator/skeleton-wrapper';

export const EditorSkeleton: React.FC = () => {
  return (
    <SkeletonWrapper className={mod.editorSkeleton}>
      {props => (
        <ContentLoader
          speed={2}
          width={951}
          height={476}
          viewBox="0 0 951 476"
          {...props}
        >
          <path d="M 31 0 h 195 v 20 H 31 z M 78 45 h 859 v 20 H 78 z M 0 90 h 909 v 20 H 0 z M 0 135 h 881 v 20 H 0 z M 0 180 h 844 v 20 H 0 z M 0 225 h 881 v 20 H 0 z M 0 270 h 922 v 20 H 0 z M 0 315 h 854 v 20 H 0 z M 0 360 h 891 v 20 H 0 z M 0 405 h 909 v 20 H 0 z M 0 450 h 692 v 20 H 0 z" />
        </ContentLoader>
      )}
    </SkeletonWrapper>
  );
};
