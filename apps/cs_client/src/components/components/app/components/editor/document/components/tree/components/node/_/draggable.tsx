import React, {
  Component,
  createRef,
  MutableRefObject,
  ReactNode,
} from 'react';

export type DraggableProps = {
  anchorId: string;
  anchorIndex: number;
  children: (provided, ref) => ReactNode;
};

export class Draggable extends Component<DraggableProps> {
  ref: MutableRefObject<HTMLElement> = createRef();
  onDragStart = e => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: this.props.anchorId,
        index: this.props.anchorIndex,
      }),
    );
  };

  render() {
    return (
      <>
        {this.props.children(
          {
            onDragStart: this.onDragStart,
            draggable: true,
          },
          this.ref,
        )}
      </>
    );
  }
}
