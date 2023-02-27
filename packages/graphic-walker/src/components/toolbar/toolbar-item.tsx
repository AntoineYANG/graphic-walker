import { ChevronDownIcon, Cog6ToothIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import React, { HTMLAttributes, memo, ReactNode, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import ToolbarButton, { ToolbarButtonItem } from "./toolbar-button";
import ToolbarToggleButton, { ToolbarToggleButtonItem } from "./toolbar-toggle-button";
import ToolbarSelectButton, { ToolbarSelectButtonItem } from "./toolbar-select-button";
import { ToolbarContainer, ToolbarItemContainerElement, ToolbarSplitter, useHandlers } from "./components";
import Toolbar, { ToolbarProps } from ".";
import Tooltip from "../tooltip";
import Callout from "../callout";


const ToolbarSplit = styled.div<{ open: boolean }>`
    flex-grow: 1;
    flex-shrink: 1;
    display: inline-block;
    height: var(--height);
    position: relative;
    margin-right: 4px;
    > svg {
        position: absolute;
        width: calc(var(--icon-size) * 0.6);
        height: calc(var(--icon-size) * 0.6);
        left: 50%;
        top: 50%;
        transform: translate(-50%, ${({ open }) => open ? '-20%' : '-50%'});
        transition: transform 120ms;
    }
    :hover > svg, :focus > svg {
        transform: translate(-50%, -20%);
    }
`;

const FormContainer = styled(ToolbarContainer)`
    width: max-content;
    height: max-content;
    background-color: #fff;
    @media (prefers-color-scheme: dark) {
        background-color: #000;
    }
`;

export interface IToolbarItem {
    key: string;
    icon: (props: React.ComponentProps<'svg'> & {
        title?: string;
        titleId?: string;
    }) => JSX.Element;
    label: string;
    /** @default false */
    disabled?: boolean;
    menu?: ToolbarProps;
    form?: JSX.Element;
    styles?: Partial<Pick<NonNullable<ToolbarProps['styles']>, 'item' | 'icon' | 'splitIcon'>>;
}

export const ToolbarItemSplitter = '-';

export type ToolbarItemProps = (
    | ToolbarButtonItem
    | ToolbarToggleButtonItem
    | ToolbarSelectButtonItem
    | typeof ToolbarItemSplitter
);

export interface IToolbarProps<P extends Exclude<ToolbarItemProps, typeof ToolbarItemSplitter> = Exclude<ToolbarItemProps, typeof ToolbarItemSplitter>> {
    item: P;
    styles?: ToolbarProps['styles'];
    openedKey: string | null;
    setOpenedKey: (key: string | null) => void;
    renderSlot: (node: ReactNode) => void;
    overflowMode?: ToolbarProps['overflowMode'];
    disabled: boolean;
}

let idFlag = 0;

export const ToolbarItemContainer = memo<{
    invisible: boolean;
    props: IToolbarProps;
    handlers: ReturnType<typeof useHandlers> | null;
    children: unknown;
} & HTMLAttributes<HTMLDivElement>>(function ToolbarItemContainer (
    {
        invisible,
        props: {
            item: { key, label, disabled = false, menu, form },
            styles, overflowMode = 'fold', openedKey, setOpenedKey, renderSlot,
        },
        handlers,
        children,
        ...props
    }
) {
    const id = useMemo(() => `toolbar-item-${idFlag++}`, []);
    const splitOnly = Boolean(form || menu) && handlers === null;

    const opened = Boolean(form || menu) && key === openedKey && !disabled;
    const openedRef = useRef(opened);
    openedRef.current = opened;

    const splitHandlers = useHandlers(() => {
        setOpenedKey(opened ? null : key);
    }, disabled ?? false, [' '], false);

    useEffect(() => {
        if (opened) {
            const close = (e?: unknown) => {
                if (!openedRef.current) {
                    return;
                }
                if (!e) {
                    setOpenedKey(null);
                } else if (e instanceof KeyboardEvent && e.key === 'Escape') {
                    setOpenedKey(null);
                } else if (e instanceof MouseEvent) {
                    setTimeout(() => {
                        if (openedRef.current) {
                            setOpenedKey(null);
                        }
                    }, 100);
                }
            };

            document.addEventListener('mousedown', close);
            document.addEventListener('keydown', close);

            return () => {
                document.removeEventListener('mousedown', close);
                document.removeEventListener('keydown', close);
            };
        }
    }, [setOpenedKey, opened]);

    useEffect(() => {
        if (opened && menu) {
            renderSlot(<Toolbar {...menu} />);
            return () => renderSlot(null);
        }
    }, [opened, menu, renderSlot]);

    return (
        <>
            <Tooltip content={label}>
                <ToolbarItemContainerElement
                    role="button" tabIndex={disabled ? undefined : 0} aria-label={label} aria-disabled={disabled ?? false}
                    split={Boolean(form || menu)}
                    style={styles?.item}
                    className={opened ? 'open' : undefined}
                    aria-haspopup={splitOnly ? 'menu' : 'false'}
                    {...(splitOnly ? splitHandlers : handlers)}
                    {...props}
                    id={invisible ? undefined : id}
                >
                    {children}
                    {form ? (
                        splitOnly ? (
                            <ToolbarSplit
                                open={opened}
                                {...splitHandlers}
                            >
                                <Cog6ToothIcon style={styles?.splitIcon}/>
                            </ToolbarSplit>
                        ) : (
                            <ToolbarSplit
                                open={opened}
                                role="button"
                                tabIndex={disabled ? undefined : 0}
                                {...splitHandlers}
                            >
                                <Cog6ToothIcon style={styles?.splitIcon}/>
                            </ToolbarSplit>
                        )
                    ) : (
                        menu && (
                            splitOnly ? (
                                <ToolbarSplit
                                    open={opened}
                                    {...splitHandlers}
                                >
                                    <ChevronDownIcon style={styles?.splitIcon} />
                                </ToolbarSplit>
                            ) : (
                                <ToolbarSplit
                                    role="button" tabIndex={disabled ? undefined : 0} aria-label={label} aria-disabled={disabled} aria-haspopup="menu"
                                    open={opened}
                                    {...splitHandlers}
                                >
                                    <Cog8ToothIcon style={styles?.splitIcon} />
                                </ToolbarSplit>
                            )
                        )
                    )}
                </ToolbarItemContainerElement>
            </Tooltip>
            {opened && !invisible && form && (
                <Callout target={`#${id}`}>
                    <FormContainer overflowMode={overflowMode} onMouseDown={e => e.stopPropagation()}>
                        {form}
                    </FormContainer>
                </Callout>
            )}
        </>
    );
});

const ToolbarItem = memo<{
    item: ToolbarItemProps;
    styles?: ToolbarProps['styles'];
    openedKey: string | null;
    setOpenedKey: (key: string | null) => void;
    renderSlot: (node: ReactNode) => void;
    disabled: boolean;
}>(function ToolbarItem ({ item, styles, openedKey, setOpenedKey, renderSlot, disabled }) {
    if (item === ToolbarItemSplitter) {
        return <ToolbarSplitter />;
    }
    if ('checked' in item) {
        return <ToolbarToggleButton item={item} styles={styles} openedKey={openedKey} setOpenedKey={setOpenedKey} renderSlot={renderSlot} disabled={disabled} />;
    } else if ('options' in item) {
        return <ToolbarSelectButton item={item} styles={styles} openedKey={openedKey} setOpenedKey={setOpenedKey} renderSlot={renderSlot} disabled={disabled} />;
    }
    return <ToolbarButton item={item} styles={styles} openedKey={openedKey} setOpenedKey={setOpenedKey} renderSlot={renderSlot} disabled={disabled} />;
});


export default ToolbarItem;
