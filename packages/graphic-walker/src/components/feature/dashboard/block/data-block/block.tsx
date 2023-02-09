import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import embed, { vega, VisualizationSpec } from 'vega-embed';
import type { View } from 'vega';
import { useDataSource } from '../../../../../store/dashboard';
import BlockRoot from '../root';
import type { DashboardDataBlock } from '../../../../../store/dashboard/interfaces';
import VisErrorBoundary from './vis-error-boundary';


const VegaDataSourceId = '__context_dataset__';

const DataBlock = observer<{ data: DashboardDataBlock }>(function DataBlock ({ data }) {
    const { specification, config } = data;
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<View>();
    const [[w, h], setSize] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        const { current: container } = containerRef;
        if (container) {
            const cb = () => {
                setSize([container.offsetWidth, container.offsetHeight]);
            };
            const ro = new ResizeObserver(cb);
            ro.observe(container);
            return () => ro.disconnect();
        }
    }, []);

    const dataSource = useDataSource();

    useEffect(() => {
        if (containerRef.current) {
            const spec = {
                ...specification,
                data: {
                    name: VegaDataSourceId,
                    values: [],
                },
                width: w,
                height: h,
                autosize: {
                    type: 'fit',
                    contains: 'padding',
                },
                // background: '#0000',
            } as VisualizationSpec;
            embed(containerRef.current, spec, {
                actions: false,
                // timeFormatLocale: getVegaTimeFormatRules(intl.get('time_format.langKey')) as any,
                config,
            }).then(res => {
                viewRef.current = res.view;
            });
        }
        return () => {
            if (viewRef.current) {
                viewRef.current.finalize();
            }
        };
    }, [specification, config, w, h]);

    useEffect(() => {
        if (viewRef.current) {
            viewRef.current.change(
                VegaDataSourceId,
                vega
                    .changeset()
                    .remove(() => true)
                    .insert(dataSource)
            );
            viewRef.current.resize();
            viewRef.current.runAsync();
        }
    }, [dataSource]);

    return (
        <BlockRoot data={data}>
            <VisErrorBoundary>
                <div ref={containerRef} />
            </VisErrorBoundary>
        </BlockRoot>
    );
});


export default DataBlock;
