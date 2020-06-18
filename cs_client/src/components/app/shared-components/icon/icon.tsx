import * as React from 'react';
import { EventHandler, useEffect, useRef } from 'react';
import { stringToSingleElement } from '::helpers/editing/execK/helpers';
import { Icons } from './helpers/icons';
import { getIconGroup } from './helpers/get-icon-group';
import { getIconPath } from './helpers/get-icon-path';

type Attributes = { width?: string; height?: string; className?: string };
type SVGAttributes = Attributes & { fill?: string };
type SvgContainerAttributes = Attributes;

const Icon = ({
  svg: { name },
  svgAttributes = {},
  containerAttributes = {},
  onClick,
  testId,
}: {
  svg: {
    name: string;
  };
  svgAttributes?: SVGAttributes;
  containerAttributes?: SvgContainerAttributes;
  onClick?: EventHandler<any>;
  testId?: string;
}) => {
  const ref = useRef<HTMLElement>();
  useEffect(() => {
    const group = getIconGroup(name);
    getIconPath({ name, group }).then(({ svg, path }) => {
      let element;
      if (group === 'cherrytree' || group === 'misc') {
        element = document.createElement('img');
        element.src = path;
      } else {
        element = stringToSingleElement(svg);
      }
      element.setAttribute('width', (18).toString());
      element.setAttribute('height', (18).toString());
      Object.entries(svgAttributes).forEach(([k, v]) => {
        element.setAttribute(k, v);
      });
      ref.current.innerHTML = '';
      ref.current.append(element);
    });
  }, [name]);
  return (
    <span
      ref={ref}
      {...containerAttributes}
      {...(onClick && { onClick })}
      {...(testId && { 'data-testid': testId })}
    />
  );
};

export { Icon, Icons };
