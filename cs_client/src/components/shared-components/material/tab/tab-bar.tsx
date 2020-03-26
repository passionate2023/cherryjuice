import * as React from 'react';

const TabBar: React.FC = ({ children }) => (
  <div className="mdc-tab-bar" role="tablist">
    <div className="mdc-tab-scroller">
      <div className="mdc-tab-scroller__scroll-area">
        <div className="mdc-tab-scroller__scroll-content">{children}</div>
      </div>
    </div>
  </div>
);

export { TabBar };
