import React from 'react';
import { Draggable, DroppableProvided } from '@kanaries/react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useGlobalStore } from '../../store';
import DataTypeIcon from '../../components/dataTypeIcon';
import { FieldPill } from './fieldPill';

interface Props {
    provided: DroppableProvided;
}
const DimFields: React.FC<Props> = props => {
    const { t } = useTranslation();
    const { provided } = props;
    const { vizStore } = useGlobalStore();
    const dimensions = vizStore.draggableFieldState.dimensions;
    return <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col space-y-1 overflow-hidden">
        <header className="py-1 px-2 capitalize font-medium">{t('constant.analytic_type.dimension')}</header>
        <div className="flex flex-col space-y-1 min-h-[8rem] pb-4 overflow-y-auto k-lg:overflow-y-hidden">
            {dimensions.map((f, index) => (
                <Draggable key={f.dragId} draggableId={f.dragId} index={index}>
                    {(provided, snapshot) => {
            
                        return (
                            <>
                                <FieldPill
                                    ref={provided.innerRef}
                                    semanticType={f.semanticType}
                                    isDragging={snapshot.isDragging}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <DataTypeIcon dataType={f.semanticType} analyticType={f.analyticType} />
                                    <span>{f.name}&nbsp;</span>
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

export default observer(DimFields);
