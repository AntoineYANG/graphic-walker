import React, { useState, useEffect } from "react";
import DatasetTable from "../../components/dataTable";
import { observer } from "mobx-react-lite";
import { useGlobalStore } from "../../store";
import type { IGWDataLoader } from "../../dataLoader";

const DatasetConfig: React.FC<{ dataLoader: IGWDataLoader }> = ({ dataLoader }) => {
    const { commonStore, vizStore } = useGlobalStore();
    const { currentDataset } = commonStore;
    const [count, setCount] = useState(0);
    useEffect(() => {
        let isCurrent = true;
        const task = dataLoader.stat();
        task.then(d => {
            if (isCurrent) {
                setCount(d.count);
            }
        }).finally(() => {
            isCurrent = false;
        });
        return () => {
            setCount(0);
            isCurrent = false;
        };
    }, [dataLoader]);
    return (
        <div className="relative">
            <DatasetTable size={100}
                total={count}
                onMetaChange={(fid, fIndex, diffMeta) => {
                    commonStore.updateCurrentDatasetMetas(fid, diffMeta)
                }}
                dataset={currentDataset}
                dataLoader={dataLoader}
            />
        </div>
    );
};

export default observer(DatasetConfig);
