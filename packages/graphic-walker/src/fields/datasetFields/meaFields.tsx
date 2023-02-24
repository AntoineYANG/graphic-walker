import React from 'react';
import { Draggable, DroppableProvided } from '@kanaries/react-beautiful-dnd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../store';
import DataTypeIcon from '../../components/dataTypeIcon';
import { FieldPill } from './fieldPill';

interface Props {
    provided: DroppableProvided;
}
const MeaFields: React.FC<Props> = props => {
    const { t } = useTranslation();
    const { provided } = props;
    const { vizStore } = useGlobalStore();
    const measures = vizStore.draggableFieldState.measures;
    return <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col space-y-1 overflow-hidden">
        <header className="py-1 px-2 capitalize font-medium">{t('constant.analytic_type.measure')}</header>
        <div className="flex flex-col space-y-1 min-h-[8rem] pb-4 overflow-y-auto k-lg:overflow-y-hidden">
            {measures.map((f, index) => (
                <Draggable key={f.dragId} draggableId={f.dragId} index={index}>
                    {(provided, snapshot) => {
                        return (
                            <>
                                <FieldPill
                                    semanticType={f.semanticType}
                                    isDragging={snapshot.isDragging}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <DataTypeIcon dataType={f.semanticType} analyticType={f.analyticType} />
                                    <span>{f.name}&nbsp;</span>
                                    {
                                        f.fid && !snapshot.isDragging && <select className="bg-transparent text-gray-700 float-right focus:outline-none focus:border-gray-500" value="" onChange={e => {
                                            if (e.target.value === 'bin') {
                                                vizStore.createBinField('measures', index)
                                            } else if (e.target.value === 'log10') {
                                                vizStore.createLogField('measures', index)
                                            }
                                        }}>
                                            <option value=""></option>
                                            <option value="bin">bin</option>
                                            <option value="log10">log10</option>
                                        </select>
                                    }
                                </FieldPill>
                                {
                                    <FieldPill className={snapshot.isDragging ? '' : 'hidden'}
                                        semanticType={f.semanticType}
                                        isDragging={snapshot.isDragging}
                                    >
                                        <DataTypeIcon dataType={f.semanticType} analyticType={f.analyticType} />
                                        <span>{f.name}&nbsp;</span>
                                    </FieldPill>
                                }
                            </>
                        );
                    }}
                </Draggable>
            ))}
        </div>
    </div>
}

export default observer(MeaFields);
