import React from 'react';

export const codegenNativeComponent = (name: string) => {
  return (props: any) => React.createElement('div', props);
};

export const ReactFabric = {};

export const AppContainer = ({ children }: any) => {
  return React.createElement(React.Fragment, null, children);
};

export default {
  codegenNativeComponent,
  ReactFabric,
  AppContainer,
};
