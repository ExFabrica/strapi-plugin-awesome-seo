import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

//Layout
import { Flex } from '@strapi/design-system/Flex';
//Icons
import Eye from '@strapi/icons/Eye';
//Table
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Typography } from '@strapi/design-system/Typography';
import { IconButton } from '@strapi/design-system/IconButton';

export const AnalyseExcludeGrid = (props) => {
    const { formatMessage } = useIntl();
    const COL_COUNT = 5;

    return <Table colCount={COL_COUNT} rowCount={props.value.length}>
        <Thead>
            <Tr>
                <Th>
                    <Typography variant="sigma">Message</Typography>
                </Th>
                <Th>
                    <Typography variant="sigma">Priority</Typography>
                </Th>
                <Th>
                    <Typography variant="sigma">Level</Typography>
                </Th>
                <Th>
                    <Typography variant="sigma">Content</Typography>
                </Th>
            </Tr>
        </Thead>
        <Tbody>
            {props.value.map(entry => <Tr key={`${entry.message}_${entry.content}`}>
                <Td>
                    <Typography textColor="neutral800">{entry.message}</Typography>
                </Td>
                <Td>
                    <Typography textColor="neutral800">{entry.priority}</Typography>
                </Td>
                <Td>
                    <Typography textColor="neutral800">{entry.level}</Typography>
                </Td>
                <Td>
                    <Typography textColor="neutral800">{entry.content}</Typography>
                </Td>
                <Td>
                    <Flex>
                        <IconButton onClick={() => console.log('Show again')} label="Show again" noBorder icon={<Eye />} />
                    </Flex>
                </Td>
            </Tr>)}
        </Tbody>
    </Table>
};

AnalyseExcludeGrid.defaultProps = {
    value: [],
};

AnalyseExcludeGrid.propTypes = {
    value: PropTypes.array,
};