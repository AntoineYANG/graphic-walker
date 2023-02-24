import React, { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import type { IMutField } from '../../interfaces';

/**
 * react-beautiful-dnd v13.1.0 bug
 * https://github.com/atlassian/react-beautiful-dnd/issues/2361
 */
export const FieldPillElement = styled.div<{isDragging: boolean}>`
    transform: ${props => !props.isDragging && 'translate(0px, 0px) !important'};
    user-select: none;
    > * {
        flex-grow: 0;
        flex-shrink: 0;
    }
    > span {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    select {
        width: 1.2em;
        cursor: pointer;
    }
`

interface IFieldPillProps {
    isDragging: boolean;
    semanticType?: IMutField["semanticType"];
    analyticType?: IMutField["analyticType"];
}

export const FieldPill = forwardRef<HTMLDivElement, IFieldPillProps & Exclude<HTMLAttributes<HTMLDivElement>, keyof IFieldPillProps>>(function FieldPill ({
    isDragging, semanticType, analyticType, children, className, ...props
}, ref) {
    return (
        <FieldPillElement
            ref={ref}
            className={`
                grow-0 shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-gray-800 truncate
                ${{
                    nominal: 'bg-indigo-100 text-indigo-800',
                    ordinal: 'bg-purple-100 text-purple-800',
                    quantitative: 'bg-green-100 text-green-800',
                    temporal: 'bg-yellow-100 text-yellow-800',
                }[semanticType ?? '']}
                hover:bg-opacity-60 ${isDragging ? 'bg-opacity-75' : 'bg-opacity-10'}
            ${className}`}
            {...props}
            isDragging={isDragging}
        >
            {children}
        </FieldPillElement>
    );
});