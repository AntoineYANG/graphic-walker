import React from "react";
import { Droppable } from "@kanaries/react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { NestContainer } from "../../components/container";
import DimFields from "./dimFields";
import MeaFields from "./meaFields";

const DatasetFields: React.FC = (props) => {
    const { t } = useTranslation("translation", { keyPrefix: "main.tabpanel.DatasetFields" });

    return (
        <NestContainer className="h-[14em] k-lg:h-full flex flex-col shadow k-sm:rounded-md overflow-hidden" style={{ paddingBlock: 0, paddingInline: 0 }}>
            <h4 className="bg-gray-100 py-1 px-2 capitalize text-left text-xs font-normal text-gray-900">{t("field_list")}</h4>
            <div className="flex-1 flex flex-row k-lg:flex-col overflow-hidden pb-1">
                <div className="overflow-hidden px-[0.6em] grow k-lg:grow-0 basis-0 k-lg:basis-auto flex flex-col">
                    <Droppable droppableId="dimensions" direction="vertical">
                        {(provided, snapshot) => <DimFields provided={provided} />}
                    </Droppable>
                </div>
                <div className="overflow-hidden px-[0.6em] grow k-lg:grow-0 basis-0 k-lg:basis-auto flex flex-col">
                    <Droppable droppableId="measures" direction="vertical">
                        {(provided, snapshot) => <MeaFields provided={provided} />}
                    </Droppable>
                </div>
            </div>
        </NestContainer>
    );
};

export default DatasetFields;
