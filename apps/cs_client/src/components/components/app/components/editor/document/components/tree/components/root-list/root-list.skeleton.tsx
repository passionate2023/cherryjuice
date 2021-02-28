import React from 'react';
import ContentLoader from 'react-content-loader';

export const RootListSkeleton: React.FC = () => (
  <ContentLoader
    speed={2}
    width={259}
    height={427}
    viewBox="0 0 259 427"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <path d="M 0 0 h 25 v 25 H 0 V 0 z M 35 0 h 164 v 25 H 35 V 0 z M 0 36.5 h 25 v 25 H 0 v -25 z M 35 36.5 h 164 v 25 H 35 v -25 z M 0 73 h 25 v 25 H 0 V 73 z M 35 73 h 164 v 25 H 35 V 73 z M 0 109.5 h 25 v 25 H 0 v -25 z M 35 109.5 h 164 v 25 H 35 v -25 z M 0 146 h 25 v 25 H 0 v -25 z M 35 146 h 164 v 25 H 35 v -25 z M 30 182.5 h 25 v 25 H 30 v -25 z M 65 182.5 h 164 v 25 H 65 v -25 z M 30 219 h 25 v 25 H 30 v -25 z M 65 219 h 164 v 25 H 65 v -25 z M 30 255.5 h 25 v 25 H 30 v -25 z M 65 255.5 h 164 v 25 H 65 v -25 z M 60 292 h 25 v 25 H 60 v -25 z M 95 292 h 164 v 25 H 95 v -25 z M 60 328.5 h 25 v 25 H 60 v -25 z M 95 328.5 h 164 v 25 H 95 v -25 z M 60 365 h 25 v 25 H 60 v -25 z M 95 365 h 164 v 25 H 95 v -25 z M 60 401.5 h 25 v 25 H 60 v -25 z M 95 401.5 h 164 v 25 H 95 v -25 z" />
  </ContentLoader>
);
