import React, { EventHandler, useEffect, useRef, useState } from 'react';
import { toDataUrl } from '::root/components/icon/hooks/helpers/to-data-url';
import { getIconGroup } from '::root/components/icon/data/get-icon-group';
import { getStyles } from '::root/components/icon/hooks/helpers/get-styles';
import { stringToSingleElement } from './helpers/string-to-element';

export type SVGProps = {
  size?: number;
  onClick?: EventHandler<any>;
  className?: string;
  testId?: string;
  image?: boolean;
  name: string;
};

const useRenderSVG = ({
  name,
  image,
  className,
  onClick,
  testId,
  size = 18,
}: SVGProps) => {
  const ref = useRef<JSX.Element>();
  const [fetched, setFetched] = useState(0);

  useEffect(() => {
    const group = getIconGroup(name);
    (group === 'material'
      ? import('../../../assets/icons/material/' + name + '.svg')
      : group === 'cherrytree'
      ? import('../../../assets/icons/cherrytree/' + name + '.svg')
      : import('../../../assets/icons/misc/' + name + '.svg')
    ).then(({ default: svg }) => {
      if (svg) {
        const props = {
          onClick,
          className,
          'data-testid': testId,
        };
        if (image) {
          props['src'] = toDataUrl(svg);
        } else {
          const svgElement = stringToSingleElement(svg) as SVGElement;
          Array.from(svgElement.attributes).forEach(({ name, value }) => {
            // if (name !== 'style')
            props[name] = name === 'style' ? getStyles(value) : value;
          });
          props['dangerouslySetInnerHTML'] = {
            __html: svgElement.innerHTML,
          };
        }
        props['width'] = size + 'px';
        props['height'] = size + 'px';
        const element = React.createElement(image ? 'img' : 'svg', props);

        ref.current = element;
        setFetched(new Date().getTime());
      }
    });
  }, [className, name]);
  return [ref.current, fetched];
};

export { useRenderSVG };
