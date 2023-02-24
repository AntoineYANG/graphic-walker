import React from "react";
import { Droppable } from "@kanaries/react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { NestContainer } from "../../components/container";
import DimFields from "./dimFields";
import MeaFields from "./meaFields";

const DatasetFields: React.FC = (props) => {
    const { t } = useTranslation("translation", { keyPrefix: "main.tabpanel.DatasetFields" });

    return (
        <NestContainer className="border-gray-200 k-md:h-[680px] flex k-md:flex-col" style={{ paddingBlock: 0, paddingInline: '0.6em' }}>
            <h4 className="text-xs mb-2 flex-grow-0 cursor-default select-none mt-2">{t("field_list")}</h4>
            <div className="pd-1 overflow-y-auto" style={{ maxHeight: "380px", minHeight: '100px' }}>
                <Droppable droppableId="dimensions" direction="vertical">
                    {(provided, snapshot) => <DimFields provided={provided} />}
                </Droppable>
            </div>
            <div className="k-md:border-t flex-grow pd-1 overflow-y-auto">
                <Droppable droppableId="measures" direction="vertical">
                    {(provided, snapshot) => <MeaFields provided={provided} />}
                </Droppable>
            </div>
        </NestContainer>
    );
};

export default DatasetFields;
