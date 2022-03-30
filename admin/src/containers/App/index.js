/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

 import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { Box } from '@strapi/design-system/Box';
import { Layout } from '@strapi/design-system/Layout';
import { NotFound, LoadingIndicatorPage, CheckPagePermissions } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import SeoPage from '../SeoPage';
import MediaPage from '../MediaPage';
import GreenPage from '../GreenPage';
import AnalyzerNav from "../../components/Layout/CmsAnalyzerNav"

//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';

const App = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      {/*<CheckPagePermissions permissions={pluginPermissions.main}>*/}
      <Helmet title={ formatMessage({id: getTrad("plugin.name")}) } />
      <Layout sideNav={<AnalyzerNav />}>
        <Suspense fallback={<LoadingIndicatorPage />}>
          <Box background="neutral100">
            <Switch>
              <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
              <Route path={`/plugins/${pluginId}/seo`} component={SeoPage} exact />
              <Route path={`/plugins/${pluginId}/media`} component={MediaPage} exact />
              <Route path={`/plugins/${pluginId}/green`} component={GreenPage} exact />
              <Route component={NotFound} />
            </Switch>
          </Box>
        </Suspense>
      </Layout>
      {/*</CheckPagePermissions>*/}
    </>
  );
};

export default App;
