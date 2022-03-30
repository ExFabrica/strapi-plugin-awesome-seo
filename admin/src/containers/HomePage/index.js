/*
 *
 * HomePage
 *
 */
import React, { memo, useState } from 'react';
//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
//Some components
import {
  LoadingIndicatorPage,
} from '@strapi/helper-plugin';
//Layout
import { ContentLayout, HeaderLayout, Layout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';

const HomePage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formatMessage } = useIntl();
  return <Main labelledBy="title" aria-busy={isLoading}>
    <HeaderLayout
      id="title"
      title={formatMessage({ id: getTrad("plugin.homepage.title") })}
      subtitle={formatMessage({ id: getTrad("plugin.homepage.subtitle") })}
    >
    </HeaderLayout>
    <ContentLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <Layout>
        </Layout>
      )}
    </ContentLayout>
  </Main>
};

export default memo(HomePage);
