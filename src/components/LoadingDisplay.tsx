import React from 'react';

type PropTypes = { message: string | JSX.Element };
function LoadingDisplay({ message }: PropTypes) {
  return <div>{message}</div>;
}

export default LoadingDisplay;
