import React, { Component, createRef, MutableRefObject } from 'react';
import { DraggableProps } from '::root/components/app/components/editor/document/components/tree/components/node/_/draggable';
import { calculateDroppingPosition } from '::root/components/app/components/editor/document/components/tree/components/node/_/helpers/find-drop-position';
export const dragEnter = 'drag-enter';

export type OnDropParam<T> = {
  source: DragObject;
  dest: DragObject;
  meta: T;
};
type OnDrop<T> = (param: OnDropParam<T>) => void;
type Props<T> = Omit<DraggableProps, 'anchorIndex'> & {
  childOfAnchor?: boolean;
  nextSiblingOfAnchor?: boolean;
  anchorClassName: string;
  meta?: T;
  onDrop: OnDrop<T>;
  onDragEnterStyleClass?: string;
};
export type DragObject = { index: number; id: string };

export class Droppable<T> extends Component<Props<T>> {
  ref: MutableRefObject<HTMLElement> = createRef();
  onDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    this.ref.current.classList.add(this.props.onDragEnterStyleClass);
    if (this.props.childOfAnchor)
      this.ref.current.parentElement.setAttribute(dragEnter, 'true');
    if (this.props.nextSiblingOfAnchor) {
      this.ref.current.previousElementSibling.setAttribute(dragEnter, 'true');
    }
  };
  onDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    this.ref.current.classList.remove(this.props.onDragEnterStyleClass);
    if (this.props.childOfAnchor)
      this.ref.current.parentElement.removeAttribute(dragEnter);
    if (this.props.nextSiblingOfAnchor)
      this.ref.current.previousElementSibling.removeAttribute(dragEnter);
  };
  getDroppingPosition = calculateDroppingPosition({
    anchorClassName: this.props.anchorClassName,
    flag: dragEnter,
  });
  onDrop = e => {
    this.onDragLeave(e);
    let source: DragObject;
    let dest: DragObject;
    try {
      source = JSON.parse(e.dataTransfer.getData('text/plain'));
      dest = {
        id: this.props.anchorId,
        index: this.getDroppingPosition(e),
      };
      if (source.id === dest.id && source.index === dest.index) return;
      this.props.onDrop({
        source: source,
        dest: dest,
        meta: this.props.meta,
      });
      // eslint-disable-next-line no-empty
    } catch {}
  };
  render() {
    return (
      <>
        {this.props.children(
          {
            onDragEnter: this.onDragEnter,
            onDragOver: this.onDragEnter,
            onDragLeave: this.onDragLeave,
            onDragEnd: this.onDragLeave,
            onDrop: this.onDrop,
            'data-droppable': 'true',
          },
          this.ref,
        )}
      </>
    );
  }
}
