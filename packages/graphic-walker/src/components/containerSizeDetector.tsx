import React, { FC, memo, useEffect, useRef, useState } from "react";
import { Subject, throttleTime } from "rxjs";


const sizes = [
    ['sm', 640],
    ['md', 768],
    ['lg', 1024],
    ['xl', 1280],
] as const;

const shorts = [
    ['flex', 'display: flex;'],
    ['flex-col', 'flex-direction: column;'],
    ['grid', 'display: grid;'],
    ['border-t', 'border-top-width: 1px;'],
    ['h-\\[680px\\]', 'height: 680px;'],
] as const;

const gridCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const GeneratedStyles = memo<{ w: number; h: number}>(function GeneratedStyles ({ w, h }) {
    return <style>`
        ${sizes.map(([flag, size]) => `
            ${shorts.map(([short, value]) => `
                .k-${flag}\\:${short} {
                    ${w >= size ? value : ''}
                }
            `).join('\n')}
            ${gridCols.map(c => `
                .k-${flag}\\:grid-cols-${c} {
                    ${w >= size ? `grid-template-columns: repeat(${c}, minmax(0, 1fr));` : ''}
                }
                .k-${flag}\\:col-span-${c} {
                    grid-column: span ${c} / span ${c};
                }
            `).join('\n')}
        `).join('\n')}
    `</style>;
});

const ContainerSizeDetector: FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [[w, h], setSize] = useState<[number, number]>(() => [window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const target = ref.current;
        if (target) {
            const size$ = new Subject<[number, number]>();
            const subscription = size$.pipe(
                throttleTime(200, undefined, { trailing: true })
            ).subscribe(size => setSize(size));
            const resizeHandler = () => {
                const rect = target.getBoundingClientRect();
                size$.next([rect.width, rect.height]);
            };
            const ro = new ResizeObserver(resizeHandler);
            ro.observe(target);
            resizeHandler();
            return () => {
                ro.disconnect();
                subscription.unsubscribe();
            };
        }
    }, []);

    return (
        <div
            aria-hidden
            className="absolute -z-50 pointer-events-none left-0 right-0 top-0 bottom-0"
            ref={ref}
        >
            <GeneratedStyles w={w} h={h} />
        </div>
    );
};


export default ContainerSizeDetector;
