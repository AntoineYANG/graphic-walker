import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import React, { CSSProperties, memo, ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolbarContainer, ToolbarSplitter } from "./components";
import ToolbarButton from "./toolbar-button";
import ToolbarItem, { ToolbarItemProps, ToolbarItemSplitter } from "./toolbar-item";


const Root = styled.div`
    width: 100%;
    --background-color: #f7f7f7;
    --color: #777;
    --color-hover: #555;
    --blue: #282958;
    --blue-dark: #1d1e38;
`;

const ShowMoreButton = styled.div`
    [role="button"] {
        > div {
            display: none;
        }
    }
`;

export interface ToolbarProps {
    items: ToolbarItemProps[];
    /** @default "fold" */
    overflowMode?: 'scroll' | 'fold';
    styles?: Partial<{
        root: CSSProperties & Record<string, string>;
        container: CSSProperties & Record<string, string>;
        item: CSSProperties & Record<string, string>;
        icon: CSSProperties & Record<string, string>;
        splitIcon: CSSProperties & Record<string, string>;
    }>;
}

const OverflowMoreKey = '__overflow_more__';

const Toolbar = memo<ToolbarProps>(function Toolbar ({ items, overflowMode = 'fold', styles }) {
    const [openedKey, setOpenedKey] = useState<string | null>(null);
    const [slot, setSlot] = useState<ReactNode>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const [itemsFoldedStartIdx, setItemsFoldedStartIdx] = useState(-1);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        setItemsFoldedStartIdx(-1);
        setShowMore(false);
        if (!container || overflowMode !== 'fold') {
            return;
        }
        const handleResize = () => {
            if (container.clientHeight < container.scrollHeight) {
                const baseTop = container.getBoundingClientRect().top;
                const children = container.childNodes;
                setItemsFoldedStartIdx(items.findIndex((_, i) => {
                    const element = children.item(i) as HTMLElement;
                    if (element) {
                        // this child element is wrapped and invisible from the user's perspective
                        return element.getBoundingClientRect().top >= baseTop + 36;
                    }
                    return false;
                }));
            } else {
                setItemsFoldedStartIdx(-1);
            }
        };
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);
        return () => {
            ro.disconnect();
        };
    }, [items, overflowMode]);

    return (
        <Root style={styles?.root}>
            <ToolbarContainer overflowMode={overflowMode} style={styles?.container}>
                <div className={`items flex-1 h-full flex ${overflowMode === 'fold' ? 'flex-wrap' : 'overflow-hidden'}`} ref={containerRef}>
                    {items.map((item, i) => {
                        if (item === ToolbarItemSplitter) {
                            return <ToolbarSplitter key={i} />;
                        }
                        return (
                            <ToolbarItem
                                key={item.key}
                                item={item}
                                styles={styles}
                                openedKey={openedKey}
                                setOpenedKey={setOpenedKey}
                                renderSlot={node => setSlot(node)}
                                disabled={itemsFoldedStartIdx !== -1 && i >= itemsFoldedStartIdx}
                            />
                        );
                    })}
                </div>
                {overflowMode === 'fold' && (
                    <ShowMoreButton className="h-full w-[36px] grow-0 shrink-0 flex items-center justify-center cursor-pointer peer">
                        {itemsFoldedStartIdx !== -1 && (
                            <ToolbarButton
                                item={{
                                    icon: EllipsisVerticalIcon,
                                    key: OverflowMoreKey,
                                    label: 'More',
                                    form: (
                                        <Root style={styles?.root} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                                            <ToolbarContainer overflowMode={overflowMode} style={{ ...styles?.container, border: 'none' }}>
                                                {items.slice(itemsFoldedStartIdx).map(item => {
                                                    if (item === ToolbarItemSplitter) {
                                                        return null;
                                                    }
                                                    return (
                                                        <ToolbarItem
                                                            key={item.key}
                                                            item={item}
                                                            styles={styles}
                                                            openedKey={openedKey}
                                                            setOpenedKey={setOpenedKey}
                                                            renderSlot={node => setSlot(node)}
                                                            disabled={false}
                                                        />
                                                    );
                                                })}
                                            </ToolbarContainer>
                                        </Root>
                                    ),
                                }}
                                openedKey={showMore ? OverflowMoreKey : null}
                                setOpenedKey={key => setShowMore(Boolean(key))}
                                renderSlot={() => {}}
                                disabled={false}
                            />
                        )}
                    </ShowMoreButton>
                )}
            </ToolbarContainer>
            {slot}
        </Root>
    );
});


export default Toolbar;
export type { ToolbarItemProps };
