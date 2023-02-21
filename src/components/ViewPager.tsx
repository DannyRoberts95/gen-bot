import { animated, useSprings } from '@react-spring/web';
import { clamp } from 'lodash';
import React, { useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import useMeasure from 'react-use-measure';

import NextImage from '@/components/NextImage';

type ViewPagerProps = {
  pages: string[];
};

export default function Viewpager(props: ViewPagerProps) {
  const { pages = [] } = props;

  const index = useRef(0);
  const [ref, { width }] = useMeasure();
  const [springProps, api] = useSprings(
    pages.length,
    (i) => ({
      x: i * width,
      scale: width === 0 ? 0 : 1,
      display: 'block',
    }),
    [width]
  );
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (active && distance > width / 2) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1
        );
        cancel();
      }
      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: 'none' };
        const x = (i - index.current) * width + (active ? mx : 0);
        const scale = active ? 1 - distance / width / 2 : 1;
        return { x, scale, display: 'block' };
      });
    }
  );

  return (
    <div ref={ref} className=' h-full w-full max-w-[100%] border-2'>
      {springProps.map(({ x, display, scale }, i) => (
        <animated.div
          className='absolute h-full w-full will-change-transform'
          {...bind()}
          key={i}
          style={{ display, x }}
        >
          <animated.div
            className='h-full w-full max-w-full bg-cover will-change-transform'
            style={{ scale }}
          />
          <NextImage src={pages[i]} fill alt='' />
        </animated.div>
      ))}
    </div>
  );
}
