import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";

//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../../utils/getTrad';

// API
import contentAnalyzerAPI from '../../../api/seo/seo-api-wrapper';
//Layout
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
//Accordion
import { Accordion, AccordionToggle, AccordionContent } from '@strapi/design-system/Accordion';
import { IconButton } from '@strapi/design-system/IconButton';
import Globe from '@strapi/icons/Globe';
import Pencil from '@strapi/icons/Pencil';
//Tab
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
// Analyse grids
import { AnalyseContentGrid } from './analyse-content-grid';
import { AnalyseFrontGrid } from './analyse-front-grid';
import { AnalyseExcludeGrid } from './analyse-exclude-grid';
//Modal
import { ModalEditTitle } from './analyse-modal-edit-title';

export const AnalyseAccordion = (props) => {
    const { formatMessage } = useIntl();
    const [seoContentManagerMessageList, setSeoContentManagerMessageList] = useState([]);
    const [seoFrontDeveloperMessageList, setSeoFrontDeveloperMessageList] = useState([]);
    const [seoExcludeMessageList, setSeoExcludeMessageList] = useState([]);
    const [editTitleModalVisible, setEditTitleModalVisible] = useState(false);
    const { push } = useHistory();

    useEffect(() => {
        if (props.value && props.value.seoAnalyse) {
            const analyses = JSON.parse(props.value.seoAnalyse);
            if (analyses && analyses.length > 0) {
                //Analyses filtering for content Manager && front dev.
                setSeoContentManagerMessageList(analyses.filter(item => item.target === 0 || item.target === 2));
                setSeoFrontDeveloperMessageList(analyses.filter(item => item.target === 1 || item.target === 2));
                setSeoExcludeMessageList([{
                    message: "test",
                    priority: 70,
                    target: 0,
                    content: ""
                }]);
            }
        }
    }, []);

    /**  #5175 - redirect to url to edit  - BEGIN */
    const handleEdit = async (id, contentKind, apiName, documentId, locale) => {
        await contentAnalyzerAPI.setAnalyzeAsChecked(id)
        push(`/content-manager/${contentKind}/${apiName}/${documentId}?plugins[i18n][locale]=${locale}`)
    }
    /* #5175 -END */

    return <Accordion key={props.id} expanded={props.toggleState[props.id]} toggle={() => props.onToggle(props.id)} id={props.id}>
        <AccordionToggle
            startIcon={<Globe aria-hidden={true} />}
            togglePosition="left"
            action={
                <Stack horizontal size={0}>
                    {/* #5175 - add link edit page - BEGIN*/}
                    <IconButton label={ formatMessage({id: getTrad("plugin.seo.table.edit")}) } icon={<Pencil />} onClick={() => handleEdit(props.value.id,props.value.contentKind,props.value.apiName,props.value.documentId, props.value.locale)}/>
                    {/* #5175 - END */}
                </Stack>
            }
            title={!props.value.isChecked ? `${ formatMessage({id: getTrad("plugin.seo.table.rank")}) }: ${props.value.depth} - ${ formatMessage({id: getTrad("plugin.seo.table.url")}) }: ${props.value.frontUrl}` : ''}
            description={props.value.isChecked ? `${ formatMessage({id: getTrad("plugin.seo.table.rank")}) }: ${props.value.depth} - ${ formatMessage({id: getTrad("plugin.seo.table.url")}) }: ${props.value.frontUrl}` : ''}
        />
        <AccordionContent>
            <Box padding={3}>
                <Box padding={4} background="neutral0">
                    <Box padding={8} background="primary100">
                        <TabGroup label="Some stuff for the label" id="tabs" onTabChange={selected => console.log(selected)}>
                            <Tabs>
                                <Tab>{ formatMessage({id: getTrad("plugin.seo.experttable.contentOptimisation")}) } ({seoContentManagerMessageList.length})</Tab>
                                <Tab>{ formatMessage({id: getTrad("plugin.seo.experttable.frontOptimisation")}) } ({seoFrontDeveloperMessageList.length})</Tab>
                                {/* #5177 : disable this tab - BEGIN */}
                                {/* <Tab>Don't show again ({seoExcludeMessageList.length})</Tab> */}
                                {/* #5177 : END */}
                            </Tabs>
                            <TabPanels>
                                <TabPanel>
                                    <AnalyseContentGrid value={seoContentManagerMessageList}></AnalyseContentGrid>
                                </TabPanel>
                                <TabPanel>
                                    <Box padding={4} background="neutral0">
                                        <AnalyseFrontGrid value={seoFrontDeveloperMessageList}></AnalyseFrontGrid>
                                    </Box>
                                </TabPanel>
                                {/* #5177 : disable this tab - BEGIN */}
                                {/* <TabPanel>
                                    <Box padding={4} background="neutral0">
                                        <AnalyseExcludeGrid value={seoExcludeMessageList}></AnalyseExcludeGrid>
                                    </Box>
                                </TabPanel> */}
                                {/* #5177 : END */}

                            </TabPanels>
                        </TabGroup>
                    </Box>
                </Box>
            </Box>
        </AccordionContent>
        <ModalEditTitle
            isVisible={editTitleModalVisible}
            onClose={() => { setEditTitleModalVisible(prev => !prev) }}
            onSave={() => { setEditTitleModalVisible(prev => !prev) }}
            value={props.value.frontUrl}>
        </ModalEditTitle>
    </Accordion>
};

AnalyseAccordion.defaultProps = {
    value: null,
    id: "id",
    onToggle: (id) => { },
    toggleState: [],
};

AnalyseAccordion.propTypes = {
    value: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    toggleState: PropTypes.object
};