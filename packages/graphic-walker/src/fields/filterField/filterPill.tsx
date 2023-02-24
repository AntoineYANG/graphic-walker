import { observer } from 'mobx-react-lite';
import React from 'react';
import { DraggableProvided } from "@kanaries/react-beautiful-dnd";
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useGlobalStore } from '../../store';


interface FilterPillProps {
    provided: DraggableProvided;
    fIndex: number;
    isDragging: boolean;
}

const FilterPill: React.FC<FilterPillProps> = observer(props => {
    const { provided, fIndex, isDragging } = props;
    const { vizStore } = useGlobalStore();
    const { draggableFieldState } = vizStore;

    const field = draggableFieldState.filters[fIndex];

    const { t } = useTranslation('translation', { keyPrefix: 'filters' });

    return (
        <div
            className={`flex flex-col py-0.5 px-2 space-y-0.5 bg-gray-100 ${isDragging ? 'bg-opacity-20 !border-t-0' : 'bg-opacity-0'}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <header className="text-gray-600 text-xs">
                {field.name}
            </header>
            <div
                className="text-gray-800 text-xs hover:bg-gray-100 flex flex-row"
                onClick={() => vizStore.setFilterEditing(fIndex)}
                style={{ cursor: 'pointer' }}
                title={t('to_edit')}
            >
                {
                    field.rule ? (
                        <span className="flex-1 truncate">
                            {
                                field.rule.type === 'one of' ? (
                                    `oneOf: [${[...field.rule.value].map(d => JSON.stringify(d)).join(', ')}]`
                                ) : field.rule.type === 'range' ? (
                                    `range: [${field.rule.value[0]}, ${field.rule.value[1]}]`
                                ) : field.rule.type === 'temporal range' ? (
                                    `range: [${new Date(field.rule.value[0])}, ${new Date(field.rule.value[1])}]`
                                ) : null
                            }
                        </span>
                    ) : (
                        <span className="text-gray-600 flex-1">
                            {t('empty_rule')}
                        </span>
                    )
                }
                <PencilSquareIcon
                    className="icon flex-grow-0 flex-shrink-0 pointer-events-none text-gray-500"
                    role="presentation"
                    aria-hidden
                    width="1.4em"
                    height="1.4em"
                />
            </div>
        </div>
    );
});


export default FilterPill;
