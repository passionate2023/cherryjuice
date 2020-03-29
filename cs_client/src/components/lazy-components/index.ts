import * as React from 'react';

const Document = React.lazy(() => import('::app/document'));
const Body = React.lazy(() => import('::app/body'));
const ErrorModal = React.lazy(() => import('::shared-components/error-modal'));
const Settings = React.lazy(() => import('::app/menus/settings'));
const InfoBar = React.lazy(() => import('::app/info-bar'));
const ToolBar = React.lazy(() => import('::app/tool-bar'));

export { Document, Body, ErrorModal, Settings, InfoBar, ToolBar };
