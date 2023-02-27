import React from "react";
import styled from "styled-components";
import { useTranslation } from 'react-i18next';
import { COLORS } from "../config";

export const AestheticSegment = styled.div`
  /* border: 1px solid #e5e7eb; */
  font-size: 12px;
  margin: 0.2em;
`

export const FieldListContainer: React.FC<{ name: string }> = (props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'constant.draggable_key' });

  return (
    <FieldListSegment className="shadow k-sm:rounded-md overflow-hidden select-none flex flex-col k-xs:flex-row">
      <div className="fl-header w-full k-xs:w-[100px] bg-gray-100 capitalize text-left text-xs font-normal text-gray-900">
        <h4>{t(props.name)}</h4>
      </div>
      <div className="fl-container">{props.children}</div>
    </FieldListSegment>
  );
};

export const AestheticFieldContainer: React.FC<{ name: string }> = props => {
  const { t } = useTranslation('translation', { keyPrefix: 'constant.draggable_key' });

  return (
    <AestheticSegment className="flex flex-col shadow k-sm:rounded-md overflow-hidden k-sm:grow select-none">
      <h4 className="bg-gray-100 py-1 px-2 capitalize text-left text-xs font-normal text-gray-900">{t(props.name)}</h4>
      <div className="flex-1 flex flex-row k-lg:flex-col overflow-hidden overflow-x-auto pb-1">{props.children}</div>
    </AestheticSegment>
  );
}

export const FilterFieldContainer: React.FC = props => {
  const { t } = useTranslation('translation', { keyPrefix: 'constant.draggable_key' });

  return (
    <FilterFieldSegment className="flex flex-col shadow k-sm:rounded-md overflow-hidden k-sm:grow select-none">
      <h4 className="bg-gray-100 py-1 px-2 capitalize text-left text-xs font-normal text-gray-900">{t("filters")}</h4>
      <div className="flex-1 flex flex-row k-lg:flex-col overflow-hidden pb-1">{props.children}</div>
    </FilterFieldSegment>
  );
}

export const FieldsContainer = styled.div`
  display: flex;
  padding: 0.2em;
  min-height: 2.4em;
  flex-wrap: wrap;
  >div{
    margin: 1px;
  }
`;

export const FilterFieldsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingBlock: '0.5em 0.8em',
  paddingInline: '0.2em',
  minHeight: '4em',
  '> div': {
    marginBlock: '0.3em',
    marginInline: '1px',
  },
});

export const FieldListSegment = styled.div`
  display: flex;
  /* border: 1px solid #e5e7eb; */
  margin: 0.2em;
  font-size: 12px;
  div.fl-header {
    /* flex-basis: 100px; */
    /* width: 100px; */
    /* border-right: 1px solid #e5e7eb; */
    flex-shrink: 0;
    h4 {
      margin: 0.6em;
      font-weight: 400;
    }
  }
  div.fl-container {
    flex-grow: 10;
    /* display: flex;
    flex-wrap: wrap; */
    /* overflow-x: auto;
    overflow-y: hidden; */
  }
`;

export const FilterFieldSegment = styled.div`
  /* border: 1px solid #e5e7eb; */
  font-size: 12px;
  margin: 0.2em;
`

export const Pill = styled.div<{colType: 'discrete' | 'continuous'}>`
  background-color: ${props => props.colType === 'continuous' ? COLORS.white : COLORS.black};
  border-color: ${props => props.colType === 'continuous' ? COLORS.black : COLORS.white};
  color: ${props => props.colType === 'continuous' ? COLORS.black : COLORS.white};
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-align-items: center;
  -webkit-user-select: none;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  cursor: default;
  display: -webkit-flex;
  display: flex;
  font-size: 12px;
  height: 20px;
  min-width: 150px;
  overflow-y: hidden;
  padding: 0 10px;
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow-color: rgb(6 182 212/0.5);
  --tw-shadow: var(--tw-shadow-colored);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow); */
`

