import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useGlobalStore } from '../../store';
import { FieldListContainer } from "../components";
import OBFieldContainer from '../obComponents/obFContainer';
import { DRAGGABLE_STATE_KEYS } from '../../utils/dnd.config';

const PosFields: React.FC = props => {
    const { vizStore } = useGlobalStore();
    const { visualConfig } = vizStore;
    const { geoms } = visualConfig;

    const channels = useMemo(() => {
        if (geoms[0] === 'arc') {
            return DRAGGABLE_STATE_KEYS.filter(f => f.id === 'radius' || f.id === 'theta');
        }
        return DRAGGABLE_STATE_KEYS.filter(f => f.id === 'columns' || f.id === 'rows');
    }, [geoms[0]])
    return <div>
        {
            channels.map(dkey => <FieldListContainer name={dkey.id} key={dkey.id}>
                <OBFieldContainer dkey={dkey} />
            </FieldListContainer>)
        }
    </div>
}

export default observer(PosFields);