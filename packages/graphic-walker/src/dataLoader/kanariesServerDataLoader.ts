import { useCallback, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import type { IDataQueryPayload, IResponse, IRow } from '../interfaces';
import type { IVisDataset, IVisField } from '../vis/protocol/interface';
import type { GWLoadDataFunction, GWLoadMetaFunction, GWSyncDataFunction, GWSyncMetaFunction, GWStatFieldFunction, GWStatFunction, GWTransformFunction, IGWDataLoader, GWUseDataFunction, GWUseMetaFunction } from ".";


type BroadcastChannel = (
    | 'init'
);

interface IGWTransformerOptions {
    server: string;
    datasetId: string;
}

interface IDatasetMeta {
    id: string;
    name: string;
    fieldsMeta: IVisField[];
    meta: {
        totalRows: number;
    };
}

interface IServerDataQueryPayload {
    datasetId: string;
    query: IDataQueryPayload;
}

export default class KanariesServerDataLoader implements IGWDataLoader {

    protected dataset: {
        meta: IDatasetMeta;
        dimensions: string[];
        measures: string[];
    } = {
        meta: {
            id: '',
            name: '',
            fieldsMeta: [],
            meta: {
                totalRows: 0,
            },
        },
        dimensions: [],
        measures: [],
    };
    protected readonly signal = new Subject<BroadcastChannel>();
    
    constructor(protected readonly options: IGWTransformerOptions) {}

    async #getRequest<P, R>(pathname: string, ...args: (P extends null | void ? [] : [data: P])): Promise<R> {
        const urlencoded = new URLSearchParams();
        const data = args[0];
        if (data) {
            for (const key in data) {
                urlencoded.append(key, data[key] && typeof data[key] === 'object' ? JSON.stringify(data[key]) : `${data[key]}`);
            }
        }
        const res = await fetch(`${this.options.server}${pathname}?${urlencoded.toString()}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (res.status === 200 || res.status === 500) {
            const result = await res.json() as IResponse<R>;
            if (result.success === false) {
                throw new Error(result.message);
            }
            return result.data;
        } else {
            throw new Error(`Service failed. ${res.status}: ${res.statusText}`);
        }
    }

    async #postRequest<P, R>(pathname: string, data: P): Promise<R> {
        const res = await fetch(`${this.options.server}${pathname}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (res.status === 200 || res.status === 500) {
            const result = await res.json() as IResponse<R>;
            if (result.success === false) {
                throw new Error(result.message);
            }
            return result.data;
        } else {
            throw new Error(`Service failed. ${res.status}: ${res.statusText}`);
        }
    }

    async #fetchDataset(): Promise<IDatasetMeta> {
        return this.#getRequest<void, IDatasetMeta>(`/api/ce/dataset/v2/${this.options.datasetId}`);
    }

    async #fetchDataView(data: IServerDataQueryPayload): Promise<IRow[]> {
        return this.#postRequest<IServerDataQueryPayload, IRow[]>(`/api/ce/dataset/v2/query`, data);
    }

    public async init() {
        const meta = await this.#fetchDataset();
        const fields = meta.fieldsMeta.map(f => ({
            ...f,
            analyticType: f.type === 'quantitative' ? 'measure' : 'dimension',
        }))
        this.dataset = {
            meta,
            measures: fields.filter(field => field.analyticType === 'measure').map(field => field.key),
            dimensions: fields.filter(field => field.analyticType === 'dimension').map(field => field.key),
        };
        this.signal.next('init');
    }

    syncMeta: GWSyncMetaFunction = async dataset => {
        // do nothing because this loader only support read-only mode
        return;
    }

    syncData: GWSyncDataFunction = async dataSource => {
        // do nothing because this loader only support read-only mode
        return;
    }

    loadMeta: GWLoadMetaFunction = async () => {
        return {
            datasetId: this.dataset.meta.id,
            dimensions: this.dataset.dimensions.map(key => this.dataset.meta.fieldsMeta.find(f => f.key === key)!).filter(Boolean),
            measures: this.dataset.measures.map(key => this.dataset.meta.fieldsMeta.find(f => f.key === key)!).filter(Boolean),
        };
    }

    useMeta: GWUseMetaFunction = () => {
        const getDataset = useCallback(() => ({
            datasetId: this.dataset.meta.id,
            dimensions: this.dataset.dimensions.map(key => this.dataset.meta.fieldsMeta.find(f => f.key === key)!).filter(Boolean),
            measures: this.dataset.measures.map(key => this.dataset.meta.fieldsMeta.find(f => f.key === key)!).filter(Boolean),
        }), []);
        const [meta, setMeta] = useState<IVisDataset>(getDataset);
        useEffect(() => {
            const subscription = this.signal.subscribe(() => {
                setMeta(getDataset);
            });
            return () => subscription.unsubscribe();
        }, [getDataset]);
        return meta;
    }

    loadData: GWLoadDataFunction = async payload => {
        if (!this.dataset) {
            return [];
        }
        const { pageIndex, pageSize } = payload;
        return this.#fetchDataView({
            datasetId: this.dataset.meta.id,
            query: {
                workflow: [{
                    type: 'view',
                    query: [{
                        op: 'raw',
                        fields: ['*'],
                    }],
                }],
                limit: pageSize,
                offset: pageIndex * pageSize,
            },
        });
    }

    useData: GWUseDataFunction = payload => {
        const { pageIndex, pageSize } = payload;
        const [data, setData] = useState<IRow[]>([]);
        const load = useCallback(async () => {
            setData(await this.loadData(payload));
        }, [pageIndex, pageSize]);
        useEffect(() => {
            const subscription = this.signal.subscribe(() => {
                this.loadData(payload).then(res => setData(res));
            });
            return () => subscription.unsubscribe();
        }, [load]);
        return data;
    }

    stat: GWStatFunction = async () => {
        if (!this.dataset) {
            return {
                count: 0,
            };
        }
        return {
            count: (await this.#fetchDataView({
                datasetId: this.dataset.meta.id,
                query: {
                    workflow: [{
                        type: 'view',
                        query: [{
                            op: 'aggregate',
                            groupBy: [],
                            measures: [{
                                field: '*',
                                agg: 'count',
                                asFieldKey: 'count',
                            }],
                        }],
                    }],
                },
            }))[0].count,
        };
    }

    query: GWTransformFunction = async payload => {
        if (!this.dataset) {
            return [];
        }
        return this.#fetchDataView({
            datasetId: this.dataset.meta.id,
            query: payload,
        });
    };

    statField: GWStatFieldFunction = async (fid, { values = false, range = false }) => {
        if (!this.dataset) {
            return {
                values: [],
                range: [0, 0],
            };
        }
        const datasetId = this.dataset.meta.id;
        const COUNT_ID = `count_${fid}`;
        const MIN_ID = `min_${fid}`;
        const MAX_ID = `max_${fid}`;
        const valuesQueryPayload: IServerDataQueryPayload = {
            datasetId,
            query: {
                workflow: [{
                    type: 'view',
                    query: [{
                        op: 'aggregate',
                        groupBy: [fid],
                        measures: [{
                            field: fid,
                            agg: 'count',
                            asFieldKey: COUNT_ID,
                        }],
                    }],
                }],
            },
        };
        const valuesRes = values ? await this.#fetchDataView(valuesQueryPayload) : [];
        const rangeQueryPayload: IServerDataQueryPayload = {
            datasetId,
            query: {
                workflow: [{
                    type: 'view',
                    query: [{
                        op: 'aggregate',
                        groupBy: [],
                        measures: [{
                            field: fid,
                            agg: 'min',
                            asFieldKey: MIN_ID,
                        }, {
                            field: fid,
                            agg: 'max',
                            asFieldKey: MAX_ID,
                        }],
                    }],
                }],
            },
        };
        const [rangeRes] = range ? await this.#fetchDataView(rangeQueryPayload) : [{
            [MIN_ID]: 0,
            [MAX_ID]: 0,
        }];

        return {
            values: valuesRes.sort((a, b) => b[COUNT_ID] - a[COUNT_ID]).slice(0, 20).map(row => ({
                value: row[fid],
                count: row[COUNT_ID],
            })),
            range: [rangeRes[MIN_ID], rangeRes[MAX_ID]],
        };
    };

}
