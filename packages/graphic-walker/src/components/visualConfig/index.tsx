import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useGlobalStore } from '../../store';
import Modal from '../modal';
import { IVisualConfig } from '../../interfaces';
import PrimaryButton from '../button/primary';
import DefaultButton from '../button/default';
import FormatPanel from './formatPanel';

const VisualConfigPanel: React.FC = (props) => {
    const { commonStore, vizStore } = useGlobalStore();
    const { showVisualConfigPanel } = commonStore;
    const { visualConfig } = vizStore;
    const { t } = useTranslation();
    const [format, setFormat] = useState<IVisualConfig['format']>({
        numberFormat: visualConfig.format.numberFormat,
        timeFormat: visualConfig.format.timeFormat,
        normalizedNumberFormat: visualConfig.format.normalizedNumberFormat,
    });

    return (
        <Modal
            show={showVisualConfigPanel}
            onClose={() => {
                commonStore.setShowVisualConfigPanel(false);
            }}
        >
            <div>
                <h2 className='text-lg mb-4'>{t('config.format')}</h2>
                <FormatPanel
                    format={format}
                    onChange={setFormat}
                />
                <div className='mt-4'>
                    <PrimaryButton
                        text={t('actions.confirm')}
                        className='mr-2'
                        onClick={() => {
                            vizStore.setVisualConfig('format', format);
                            commonStore.setShowVisualConfigPanel(false);
                        }}
                    />
                    <DefaultButton
                        text={t('actions.cancel')}
                        className='mr-2'
                        onClick={() => {
                            commonStore.setShowVisualConfigPanel(false);
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default observer(VisualConfigPanel);
