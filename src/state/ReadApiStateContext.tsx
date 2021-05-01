import * as React from 'react';
import classnames from 'classnames';
import { ReadApiState } from './ReadApiState';
import { Observer } from 'mobx-react';
import { Loading } from '../components/Loading';


interface ReadApiStateContextProps<T, E extends { message: string }, P extends any[]> {
  /**
   * The state to observe and show either loading, error or data for
   */
  state: ReadApiState<T, E, P>;
  /**
   * Custom loading element
   */
  loader?: React.ReactNode;

  /**
   * Render the components that need the actual data
   * Here the data and all depended data is guaranteed to be fully loaded and defined
   * @param data
   */
  children: (data: T) => React.ReactNode;
}

type Props<T, E extends { message: string }, P extends any[]> = ReadApiStateContextProps<T, E, P>;

/**
 * Helper HOC to be used with ApiState
 * Handles Loading and error cases and render the child components only after the data is fully defined
 */
export class ReadApiStateContext<T, E extends { message: string }, P extends any[]> extends React.Component<
  Props<T, E, P>
> {

  public render(): React.ReactNode {
    return (
      /** Important !!!
       *  Use here the Observer and not the @observer class decorator
       *  The Hot module reloading (HMR) does not work together with the decorator class syntax!
       */
      <Observer>
        {() => {
          const props = this.props;

          const { data } = props.state;

          let { error, isLoading } = props.state;


          if (error) {
            return (
              <div>
                {error.message}
              </div>
          );
          }

          if (isLoading || data === undefined ) {
            return <Loading inline />;
          }

          return <div className={classnames('loaderWrapper')}>{props.children(data)}</div>;
        }}
      </Observer>
      
    );
  }
}
