import React, { CSSProperties, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/container';
import Modal from '../components/modal';
import { useGlobalStore } from '../store';
import { download } from '../utils/save';
import GwFile from './dataSelection/gwFile';
import DataSelection from './dataSelection';

interface DSSegmentProps {
    preWorkDone: boolean;
    style?: CSSProperties;
}

const DataSourceSegment: React.FC<DSSegmentProps> = props => {
    const { preWorkDone, style } = props;
    const { commonStore, vizStore } = useGlobalStore();
    const gwFileRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const { currentDataset, datasets, showDSPanel } = commonStore;

    return <Container className="GW__container flex-grow-0 flex-shrink-0 flex flex-row items-stretch" style={style}>
        <GwFile fileRef={gwFileRef} />
        {!preWorkDone && <div className="animate-spin inline-block mr-2 ml-2 w-4 h-4 rounded-full border-t-2 border-l-2 border-blue-500"></div>}
        <label className="text-xs mr-1 whitespace-nowrap self-center h-4">
            {t('DataSource.labels.cur_dataset')}
        </label>
        <select
            className="border border-gray-500 rounded-sm text-xs pt-0.5 pb-0.5 pl-2 pr-2"
            value={currentDataset.id}
            onChange={(e) => { commonStore.useDS(e.target.value); }}
        >
            {datasets.map((ds) => (
                <option value={ds.id} key={ds.id}>
                    {ds.name}
                </option>
            ))}
        </select>

        <button className="inline-block min-w-96 text-xs ml-2 pt-1 pb-1 pl-6 pr-6 border border-gray-500 rounded-sm hover:bg-gray-200"
            onClick={() => { commonStore.startDSBuildingTask() }}
        >
            {t('DataSource.buttons.create_dataset')}
        </button>
        <button className="inline-block min-w-96 text-xs ml-2 pt-1 pb-1 pl-6 pr-6 border border-gray-500 rounded-sm hover:bg-gray-200"
            onClick={() => {
                const res = vizStore.exportAsRaw();
                download(res, 'graphic-walker-notebook.json', 'text/plain')
            }}
        >
            {t('DataSource.buttons.export_as_file')}
        </button>
        <button className="inline-block min-w-96 text-xs ml-2 pt-1 pb-1 pl-6 pr-6 border border-gray-500 rounded-sm hover:bg-gray-200"
            onClick={() => {
                if (gwFileRef.current) {
                    gwFileRef.current.click();
                }
            }}
        >
            {t('DataSource.buttons.import_file')}
        </button>
        {showDSPanel && (
            <Modal
                title={t('DataSource.dialog.create_data_source')}
                onClose={() => { commonStore.setShowDSPanel(false) }}
            >
                <DataSelection />
                {/* <DataSourcePanel /> */}
            </Modal>
        )}
        { preWorkDone && <CheckCircleIcon className="text-green-500 w-5 inline-block ml-2" /> }
        { !preWorkDone && <ArrowPathIcon className="text-yellow-500 w-5 inline-block ml-2" />}
    </Container>
}

export default observer(DataSourceSegment);