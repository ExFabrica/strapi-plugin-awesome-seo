import React from 'react';
import PropTypes from 'prop-types';

//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../../utils/getTrad';

//Layout
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
//Icons
import Pencil from '@strapi/icons/Pencil';
import Trash from '@strapi/icons/Trash';
import Earth from '@strapi/icons/Earth';
import Eye from '@strapi/icons/EyeStriked';
//Table
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Typography } from '@strapi/design-system/Typography';
import { IconButton } from '@strapi/design-system/IconButton';
//Badge
import { Badge } from '@strapi/design-system/Badge';

import {getSeoWarningLevelColor,getSeoErrorLevelColor, getBadgeTextColor  }from '../../../utils/getSeoColor.js';

export const AnalyseFrontGrid = (props) => {
    const { formatMessage } = useIntl();
    const COL_COUNT = 5;
    const low_color = getSeoWarningLevelColor();
    const high_color = getSeoErrorLevelColor();

    return <Table colCount={COL_COUNT} rowCount={props.value.length}>
        <Thead>
            <Tr>
                <Th>
                    <Typography variant="sigma">{ formatMessage({id: getTrad("plugin.seo.experttable.tag")}) }</Typography>
                </Th>
                <Th>
                    <Typography variant="sigma">{ formatMessage({id: getTrad("plugin.seo.experttable.message")}) }</Typography>
                </Th>
                <Th>
                    <Typography variant="sigma">{ formatMessage({id: getTrad("plugin.seo.experttable.level")}) }</Typography>
                </Th>
                <Th>
                    <Typography variant="sigma">{ formatMessage({id: getTrad("plugin.seo.experttable.content")}) }</Typography>
                </Th>
            </Tr>
        </Thead>
        <Tbody>
            {props.value.map(entry => <Tr key={`${entry.message}_${entry.content}`}>
                <Td>
                    <Typography textColor="neutral800">{entry.tag}</Typography>
                </Td>
                <Td>
                    <Typography textColor="neutral800">{entry.message}</Typography>
                </Td>
                <Td>
                    {
                        entry.level === "warnings"
                            ? <Badge backgroundColor={low_color} textColor={getBadgeTextColor(low_color)} paddingLeft="5" paddingRight="5" paddingTop="2" paddingBottom="2">Low</Badge>
                            : <Badge backgroundColor={high_color} textColor={getBadgeTextColor(high_color)} paddingLeft="5" paddingRight="5" paddingTop="2" paddingBottom="2">High</Badge>
                    }
                </Td>
                <Td>
                    <Typography textColor="neutral800">{entry.content}</Typography>
                </Td>
                {/* #5179 disable action icons not yet implemented - BEGIN*/}
                {/* <Td>
                    <Flex>
                        <IconButton onClick={() => console.log('View')} label="View" noBorder icon={<Earth />} />
                        <Box paddingLeft={1}>
                            <IconButton onClick={() => console.log("Don't show again")} label="Don't show again" noBorder icon={<Eye />} />
                        </Box>
                        <Box paddingLeft={1}>
                            <IconButton onClick={() => console.log('edit')} label="Edit" noBorder icon={<Pencil />} />
                        </Box>
                        <Box paddingLeft={1}>
                            <IconButton onClick={() => console.log('delete')} label="Delete" noBorder icon={<Trash />} />
                        </Box>
                    </Flex>
                </Td> */}
                {/* #5179 END*/}
            </Tr>)}
        </Tbody>
    </Table>
};

AnalyseFrontGrid.defaultProps = {
    value: [],
};

AnalyseFrontGrid.propTypes = {
    value: PropTypes.array,
};