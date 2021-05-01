import * as React from 'react';
import { Loader, LoaderProps } from 'semantic-ui-react';

export class Loading extends React.Component<LoaderProps> {
  public render(): JSX.Element {
    const { size, inline } = this.props;

    return <Loader active size={size || 'small'} inline={inline} />;
  }
}