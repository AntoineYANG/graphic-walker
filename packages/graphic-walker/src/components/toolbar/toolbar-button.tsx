import React, { memo } from "react";
import { IToolbarItem, IToolbarProps, ToolbarItemContainer } from "./toolbar-item";
import { useHandlers } from "./components";


export interface ToolbarButtonItem extends IToolbarItem {
    onClick?: () => void;
}

const ToolbarButton = memo<IToolbarProps<ToolbarButtonItem>>(function ToolbarButton(props) {
    const { item, styles, darkModePreference } = props;
    const { icon: Icon, label, disabled, onClick } = item;
    const handlers = useHandlers(() => onClick?.(), disabled ?? false);

    const mergedIconStyles = {
        ...styles?.icon,
        ...item.styles?.icon,
    };

    return (
        <>
            <ToolbarItemContainer
                props={props}
                handlers={onClick ? handlers : null}
                darkModePreference={darkModePreference}
            >
                <Icon style={mergedIconStyles} />
            </ToolbarItemContainer>
        </>
    );
});


export default ToolbarButton;
