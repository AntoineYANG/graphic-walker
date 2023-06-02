import React, { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { observer } from 'mobx-react-lite';
import { IVisualConfig } from '../../interfaces';
import DefaultTab, { ITabOption } from '../tabs/defaultTab';
import DropdownSelect from '../dropdownSelect';
import { D3FormatSign, D3FormatSymbol, D3FormatType, compileD3Format, stringifyD3Format } from './format';

export interface IFormatPanelProps {
    format: IVisualConfig['format'];
    onChange: (format: IVisualConfig['format'] | ((format: IVisualConfig['format']) => IVisualConfig['format'])) => void;
}

const RawForm = observer<IFormatPanelProps>(function RawFormatPanel ({ format, onChange }) {
    const { t } = useTranslation();
    const formatConfigList: (keyof IVisualConfig['format'])[] = [
        'numberFormat',
        'timeFormat',
        'normalizedNumberFormat',
    ];

    return (
        <div>
            <p className='text-xs'>Format guides docs: <a target="_blank" className='underline text-blue-500' href="https://github.com/d3/d3-format#locale_format">read here</a></p>
            {formatConfigList.map((fc) => (
                <div className="my-2" key={fc}>
                    <label className="block text-xs font-medium leading-6 text-gray-900">{t(`config.${fc}`)}</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            className="block w-full rounded-md border-0 py-1 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={format[fc] ?? ''}
                            onChange={(e) => {
                                onChange((f) => ({
                                    ...f,
                                    [fc]: e.target.value,
                                }));
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});

const FormSet = styled.div`
    grid-template-rows: repeat(2, minmax(0, min-content));
    grid-template-columns: repeat(3, minmax(10rem, min-content));
    grid-auto-flow: column;
`;

const NumberFormatForm = observer<{ value: string; onChange: (value: string) => void }>(function NumberFormatForm ({ value, onChange }) {
    const { t } = useTranslation();
    const option = useMemo(() => compileD3Format(value), [value]);
    const handleChange = (next: Partial<typeof option>) => {
        onChange(stringifyD3Format({
            ...option,
            ...next,
        }));
    };
    const typeOptions = useMemo(() => [
        {
            value: D3FormatType.None,
            label: t('config.numberFormat.type.number', { defaultValue: 'Number' }),
        },
        {
            value: D3FormatType.Nice,
            label: t('config.numberFormat.type.currency', { defaultValue: 'Currency' }),
        },
        {
            value: D3FormatType.Percent,
            label: t('config.numberFormat.type.percent', { defaultValue: 'Percent' }),
        },
        {
            value: D3FormatType.Exponent,
            label: t('config.numberFormat.type.exponent', { defaultValue: 'Scientific notation' }),
        },
        {
            value: D3FormatType.DecimalOrExponent,
            label: t('config.numberFormat.type.decimalOrExponent', { defaultValue: 'Floating point' }),
        },
        {
            value: D3FormatType.Character,
            label: t('config.numberFormat.type.character', { defaultValue: 'Text' }),
        },
    ], [t]);
    const signalOptions = useMemo(() => [
        {
            value: D3FormatSign.Minus,
            label: '1.2, 0, -1.2',
        },
        {
            value: D3FormatSign.Plus,
            label: '+1.2, 0, -1.2',
        },
        // FIXME: updated failed
        // {
        //     value: D3FormatSign.Parentheses,
        //     label: '1.2, 0, (1.2)',
        // },
        {
            value: D3FormatSign.Space,
            label: '\u20031.2, \u20030, -1.2',
        },
    ], []);

    return (
        <FormSet className="grid gap-x-4 gap-y-1 py-2">
            <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.numberFormat.type', { defaultValue: 'Type' })}</label>
            <div className="inline-block relative">
                <DropdownSelect
                    options={typeOptions}
                    selectedKey={option.type}
                    className="w-40 min-w-[fit-content]"
                    buttonClassName="w-full"
                    onSelect={type => {
                        if (type === D3FormatType.None) {
                            handleChange({
                                type: D3FormatType.None,
                                symbol: undefined,
                            });
                        } else if (type ===D3FormatType.Nice) {
                            handleChange({
                                type: D3FormatType.Nice,
                                precision: 2,
                                symbol: D3FormatSymbol.Currency,
                            });
                        } else if (type === D3FormatType.Percent) {
                            handleChange({
                                type: D3FormatType.Percent,
                                precision: 2,
                                symbol: undefined,
                            });
                        } else if (type === D3FormatType.Exponent) {
                            handleChange({
                                type: D3FormatType.Exponent,
                                symbol: undefined,
                            });
                        } else if (type === D3FormatType.DecimalOrExponent) {
                            handleChange({
                                type: D3FormatType.DecimalOrExponent,
                                symbol: undefined,
                            });
                        } else if (type === D3FormatType.Character) {
                            handleChange({
                                type: D3FormatType.Character,
                                symbol: undefined,
                            });
                        }
                    }}
                />
            </div>
            <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.numberFormat.sign', { defaultValue: 'Signal' })}</label>
            <div className="inline-block relative">
                <DropdownSelect
                    options={signalOptions}
                    selectedKey={option.sign ?? D3FormatSign.Minus}
                    className="w-40 min-w-[fit-content]"
                    buttonClassName="w-full"
                    onSelect={sign => {
                        handleChange({
                            sign: sign as D3FormatSign,
                        });
                    }}
                />
            </div>
            {option.type !== D3FormatType.Character && (
                <>
                    <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.numberFormat.precision', { defaultValue: 'Precision' })}</label>
                    <div className="inline-block relative">
                        <input
                            type="number"
                            className="block w-full rounded-md border-0 py-0.5 px-2 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-300 sm:text-sm sm:leading-6"
                            placeholder="auto"
                            value={option.precision ?? ''}
                            onChange={e => {
                                const str = e.target.value.replaceAll(/[^0-9]/g, '');
                                if (!str) {
                                    handleChange({
                                        precision: undefined,
                                    });
                                    return;
                                }
                                const val = Number(e.target.value.replaceAll(/[^0-9]/g, ''));
                                handleChange({
                                    precision: Number.isFinite(val) && val >= 0 && val === Math.floor(val) ? val : option.precision,
                                });
                            }}
                        />
                    </div>
                    <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.numberFormat.groupSeparator', { defaultValue: 'Separator' })}</label>
                    <div className="inline-flex items-center content-center relative">
                        <input
                            type="checkbox"
                            className="block mx-4 rounded-md border-0 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-300 sm:text-sm sm:leading-6"
                            checked={option.groupSeparator}
                            onChange={e => {
                                handleChange({
                                    groupSeparator: e.target.checked,
                                });
                            }}
                        />
                    </div>
                </>
            )}
        </FormSet>
    );
});

const allTimeFormatKeys = ['year', 'month', 'weekday', 'day', 'hour', 'minute', 'second'] as const;
type TimeFormatKey = typeof allTimeFormatKeys[number];
const isDatePart = (key: TimeFormatKey): boolean => ['year', 'month', 'day'].includes(key);
const isTimePart = (key: TimeFormatKey): boolean => ['hour', 'minute', 'second'].includes(key);

interface TimeFormatOptions {
    parts: {
        key: TimeFormatKey;
        pattern: string;
    }[];
    dateSeparator: string;
    timeZone: boolean;
}

const stringifyTimeFormat = (options: TimeFormatOptions): string => {
    const { parts, dateSeparator } = options;
    const safeDateSeparator = dateSeparator.replaceAll(/%/g, '%%').replaceAll(/\s+/g, '-');
    const dateParts = parts.filter(part => ['year', 'month', 'day'].includes(part.key));
    const hasWeekday = parts.some(part => part.key === 'weekday');
    const timeParts = parts.filter(part => ['hour', 'minute', 'second'].includes(part.key));
    const datePattern = dateParts.map(part => part.pattern).join(safeDateSeparator);
    const weekdayPattern = hasWeekday ? ' %a' : '';
    const timePattern = timeParts.map(part => part.pattern).join(':');
    return `${datePattern}${weekdayPattern} ${timePattern}${
        timePattern ? `${options.timeZone ? ' (%Z)' : ''}` : ''
    }`;
};

const compileTimeFormat = (raw: string): TimeFormatOptions | undefined => {
    try {
        const parts: TimeFormatOptions['parts'] = [];
        const dateSeparator = raw.match(/[^%a-zA-Z0-9]/)?.[0] ?? '/';
        const timeSeparator = ':';
        const timeZone = raw.includes('%Z');
        const datePattern = raw.split(' ')[0];
        const timePattern = raw.split(' ')[1];
        const dateParts = datePattern.split(dateSeparator);
        const timeParts = timePattern?.split(timeSeparator) ?? [];
        const allParts = [...dateParts, ...timeParts];
        for (const part of allParts) {
            if (part === '%Y') {
                parts.push({
                    key: 'year',
                    pattern: part,
                });
            } else if (part === '%m') {
                parts.push({
                    key: 'month',
                    pattern: part,
                });
            } else if (part === '%a' || part === '%A') {
                parts.push({
                    key: 'weekday',
                    pattern: part,
                });
            } else if (part === '%d') {
                parts.push({
                    key: 'day',
                    pattern: part,
                });
            } else if (part === '%H') {
                parts.push({
                    key: 'hour',
                    pattern: part,
                });
            } else if (part === '%M') {
                parts.push({
                    key: 'minute',
                    pattern: part,
                });
            } else if (part === '%S') {
                parts.push({
                    key: 'second',
                    pattern: part,
                });
            }
        }
        return {
            parts,
            dateSeparator,
            timeZone,
        };
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error(error);
        }
        return undefined;
    }
};

const TimeFormatForm = observer<{ value: string; onChange: (value: string) => void }>(function TimeFormatForm ({ value, onChange }) {
    const { t } = useTranslation();
    const option = useMemo(() => compileTimeFormat(value) ?? {
        parts: [],
        dateSeparator: '/',
        timeZone: false,
    }, [value]);
    const handleChange = (option: TimeFormatOptions) => {
        onChange(stringifyTimeFormat(option));
    };
    const unusedKeys = useMemo(() => {
        const usedKeys = option.parts.map(part => part.key) ?? [];
        return allTimeFormatKeys.filter(key => !usedKeys.includes(key));
    }, [option.parts]);
    const addPart = (key: TimeFormatKey, pattern: string) => {
        handleChange({
            ...option,
            parts: [
                ...option.parts,
                { key, pattern },
            ],
        });
    };

    return (
        <div>
            <div className="flex flex-wrap items-center my-2">
                <div className="flex items-center flex-grow h-10 px-3 min-w-[10rem] border rounded-md border-gray-300/50 dark:border-gray-600/50">
                    {unusedKeys.map(key => (
                        <button
                            key={key}
                            className="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium leading-4 text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:focus:ring-indigo-300"
                            onClick={() => {
                                if (key === 'year') {
                                    addPart(key, '%Y');
                                } else if (key === 'month') {
                                    addPart(key, '%m');
                                } else if (key === 'weekday') {
                                    addPart(key, '%A');
                                } else if (key === 'day') {
                                    addPart(key, '%d');
                                } else if (key === 'hour') {
                                    addPart(key, '%H');
                                } else if (key === 'minute') {
                                    addPart(key, '%M');
                                } else if (key === 'second') {
                                    addPart(key, '%S');
                                }
                            }}
                        >
                            {t(`config.timeFormat.${key}`, { defaultValue: key })}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-wrap items-center my-2">
                {/* if contains more than 1 date parts */}
                {option.parts.filter(part => isDatePart(part.key)).length > 1 && (
                    <div className="flex items-center flex-grow h-10 px-3 min-w-[10rem] space-x-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {t('config.timeFormat.dateSeparator', { defaultValue: 'Date Separator' })}
                        </label>
                        <input
                            type="text"
                            className="block w-8 rounded-md border-0 py-0.5 px-2 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-300 sm:text-sm sm:leading-6 text-center"
                            value={option.dateSeparator.replace(/^\//, '')}
                            placeholder="/"
                            onChange={e => {
                                const char = e.target.value.trim().slice(0, 1) || '/';
                                handleChange({
                                    ...option,
                                    dateSeparator: char,
                                });
                            }}
                        />
                    </div>
                )}
                {/* if contains time parts */}
                {option.parts.filter(part => isTimePart(part.key)).length > 0 && (
                    <div className="flex items-center flex-grow h-10 px-3 min-w-[10rem] space-x-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {t('config.timeFormat.timeZone', { defaultValue: 'Time Zone' })}
                        </label>
                        <input
                            type="checkbox"
                            className="rounded-md border-gray-300/50 dark:border-gray-600/50 text-indigo-600 dark:text-indigo-300 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                            checked={option.timeZone}
                            onChange={e => {
                                handleChange({
                                    ...option,
                                    timeZone: e.target.checked,
                                });
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="mt-2">
                {option.parts.map((part, index, arr) => {
                    const isCurDatePart = isDatePart(part.key);
                    const isPrevDatePart = index > 0 && isDatePart(arr[index - 1].key);
                    const isCurTimePart = isTimePart(part.key);
                    const isPrevTimePart = index > 0 && isTimePart(arr[index - 1].key);
                    return (
                        <Fragment key={index}>
                            {isCurDatePart && isPrevDatePart && (
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mx-2">
                                    {option.dateSeparator}
                                </span>
                            )}
                            {isCurTimePart && isPrevTimePart && (
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mx-2">
                                    {':'}
                                </span>
                            )}
                            {isCurTimePart && isPrevDatePart && (
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mx-3">
                                    {' '}
                                </span>
                            )}
                            <div
                                key={index}
                                className="inline-flex items-center px-2 py-1 mx-1 text-xs font-medium leading-4 text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:focus:ring-indigo-300"
                            >
                                {t(`config.timeFormat.${part.key}`, { defaultValue: part.key })}
                                <button
                                    className="ml-2 text-xs font-medium leading-4 text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:focus:ring-indigo-300"
                                    onClick={() => {
                                        const newParts = [...option.parts];
                                        newParts.splice(index, 1);
                                        handleChange({
                                            ...option,
                                            parts: newParts,
                                        });
                                    }}
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
});

const GUIForm = observer<IFormatPanelProps>(function GUIFormatPanel ({ format, onChange }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-[20em] max-h-[50vh]">
            <div className="mt-2 mb-4">
                <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.numberFormat')}</label>
                <NumberFormatForm
                    value={format.numberFormat ?? ''}
                    onChange={(value) => {
                        onChange((f) => ({
                            ...f,
                            numberFormat: value,
                        }));
                    }}
                />
            </div>
            <div className="mt-2 mb-4">
                <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.timeFormat')}</label>
                <TimeFormatForm
                    value={format.timeFormat ?? ''}
                    onChange={(value) => {
                        onChange((f) => ({
                            ...f,
                            timeFormat: value,
                        }));
                    }}
                />
            </div>
            <div className="mt-2 mb-4">
                <label className="block text-xs font-medium leading-6 text-gray-900">{t('config.normalizedNumberFormat')}</label>
                <NumberFormatForm
                    value={format.normalizedNumberFormat ?? '%'}
                    onChange={(value) => {
                        onChange((f) => ({
                            ...f,
                            normalizedNumberFormat: value,
                        }));
                    }}
                />
            </div>
        </div>
    );
});

const FormatPanel = observer<IFormatPanelProps>(function FormatPanel ({ format, onChange }) {
    const { t } = useTranslation();

    const tabs = useMemo<ITabOption[]>(() => [
        {
            key: 'gui',
            label: t(`config.format.panels.gui`, { defaultValue: 'GUI' }),
        },
        {
            key: 'raw',
            label: t(`config.format.panels.raw`, { defaultValue: 'Raw' }),
        },
    ], [t]);

    const [selectedKey, setSelectedKey] = useState('gui');

    return (
        <>
            <DefaultTab
                tabs={tabs}
                selectedKey={selectedKey}
                onSelected={setSelectedKey}
            />
            {selectedKey === 'raw' && (
                <RawForm
                    format={format}
                    onChange={onChange}
                />
            )}
            {selectedKey === 'gui' && (
                <GUIForm
                    format={format}
                    onChange={onChange}
                />
            )}
        </>
    );
});

export default FormatPanel;
