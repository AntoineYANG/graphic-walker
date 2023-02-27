import React, { FC, memo, useLayoutEffect, useRef, useState } from "react";
import { Subject, throttleTime } from "rxjs";


const sizes = [
    ['3xs', 360],
    ['2xs', 440],
    ['xs', 520],
    ['sm', 640],
    ['md', 768],
    ['lg', 920],
    ['xl', 1024],
    ['2xl', 1280],
    ['3xl', 1536],
] as const;

const shorts = [
    ['block', 'display: block;'],
    ['hidden', 'display: none;'],
    ['flex', 'display: flex;'],
    ['flex-col', 'flex-direction: column;'],
    ['flex-row', 'flex-direction: row;'],
    ['grow', 'flex-grow: 1;'],
    ['grow-0', 'flex-grow: 0;'],
    ['shrink', 'flex-shrink: 1;'],
    ['shrink-0', 'flex-shrink: 0;'],
    ['basis-0', 'flex-basis: 0;'],
    ['basis-auto', 'flex-basis: auto;'],
    ['grid', 'display: grid;'],
    ['border-t', 'border-top-width: 1px;'],
    ['rounded-md', 'border-radius: 6px;'],
    ['w-full', 'width: 100%;'],
    ['w-\\[100px\\]', 'width: 100px;'],
    ['h-full', 'height: 100%;'],
    ['overflow-y-auto', 'overflow-y: auto;'],
    ['overflow-y-hidden', 'overflow-y: hidden;'],
    ['mt-0', 'margin-top: 0;'],
] as const;

const gridCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const GeneratedStyles = memo<{ w: number; h: number}>(function GeneratedStyles ({ w, h }) {
    return <style>{`
        ${sizes.map(([flag, size]) => `
            ${shorts.map(([short, value]) => `
                .k-${flag}\\:${short} {
                    ${w >= size ? value : ''}
                }
            `).join('')}
            ${gridCols.map(c => `
                .k-${flag}\\:grid-cols-${c} {
                    ${w >= size ? `grid-template-columns: repeat(${c}, minmax(0, 1fr));` : ''}
                }
                .k-${flag}\\:col-span-${c} {
                    ${w >= size ? `grid-column: span ${c} / span ${c};` : ''}
                }
            `).join('')}
        `).join('')}
        ${shorts.map(([short, value]) => `
            .k-landscape\\:${short} {
                ${w >= h ? value : ''}
            }
            .k-portrait\\:${short} {
                ${w < h ? value : ''}
            }
        `).join('')}
        ${gridCols.map(c => `
            .k-landscape\\:grid-cols-${c} {
                ${w >= h ? `grid-template-columns: repeat(${c}, minmax(0, 1fr));` : ''}
            }
            .k-landscape\\:col-span-${c} {
                ${w >= h ? `grid-column: span ${c} / span ${c};` : ''}
            }
            .k-portrait\\:grid-cols-${c} {
                ${w < h ? `grid-template-columns: repeat(${c}, minmax(0, 1fr));` : ''}
            }
            .k-portrait\\:col-span-${c} {
                ${w < h ? `grid-column: span ${c} / span ${c};` : ''}
            }
        `).join('')}
    `}</style>;
});

const ContainerSizeDetector: FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [[w, h], setSize] = useState<[number, number]>(() => [NaN, NaN]);

    useLayoutEffect(() => {
        const target = ref.current;
        if (target) {
            const size$ = new Subject<[number, number]>();
            const subscription = size$.pipe(
                throttleTime(200, undefined, { leading: true, trailing: true })
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
