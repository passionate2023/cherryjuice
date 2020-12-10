import { EventHandler, useEffect, useRef, useState } from 'react';
import { stringToSingleElement } from '@cherryjuice/editor';
import React from 'react';
import { getAttributes } from '@cherryjuice/editor';

const useRenderSVG = (
  svg: string,
  {
    className,
    onClick,
    testId,
    width,
    height,
  }: {
    name: string;
    width: string;
    height: string;
    onClick?: EventHandler<any>;
    className?: string;
    testId?: string;
  },
) => {
  const ref = useRef<JSX.Element>();
  const [fetched, setFetched] = useState(0);

  useEffect(() => {
    if (svg) {
      const svgElement = stringToSingleElement(svg);
      const element = React.createElement('svg', {
        ...getAttributes([])(svgElement),
        dangerouslySetInnerHTML: {
          __html: svgElement.innerHTML,
        },
        onClick,
        width,
        height,
        className,
        ...(testId && { 'data-testid': testId }),
      });

      ref.current = element;
      setFetched(new Date().getTime());
    }
  }, [className, svg]);
  return [ref.current, fetched];
};

export { useRenderSVG };
