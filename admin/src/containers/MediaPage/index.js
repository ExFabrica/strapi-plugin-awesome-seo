
import React, { memo, useEffect, useState } from 'react';
//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
//Layout
import { ContentLayout, HeaderLayout, Layout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
//Custom
import { Button } from '@strapi/design-system/Button';
import Plus from '@strapi/icons/Plus';
//API Wrapper
import settingsAPIWrapper from '../../api/settings/settings-api-wrapper';
import mediasAPIWrapper from '../../api/medias/medias-api-wrapper';

const MediaPage = (props) => {
  const { formatMessage } = useIntl();
  const [settings, setSettings] = useState();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    try {
      settingsAPIWrapper.get().then(settings => {
        setSettings(settings);
      });
    }
    catch (err) {
      console.log("HomePage mount error: ", err);
    }
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      mediasAPIWrapper.run(settings.frontUrl).then((result) => {
        console.log("runConsolidation result ", result);
      }, (err) => {
        console.log(err);
      });
    } catch (err) {
      console.log("handleSubmit try catch err ", err);
    }
  }

  return <Main labelledBy="title" aria-busy={isLoading}>
    <HeaderLayout
      id="title"
      title={formatMessage({ id: getTrad("plugin.homepage.title") })}
      subtitle={formatMessage({ id: getTrad("plugin.homepage.subtitle") })}
      primaryAction={
        <Button onClick={handleSubmit} startIcon={<Plus />} size="L" >
          {formatMessage({ id: getTrad("plugin.seo.runAnalysis") })}
        </Button>
      }
    >
    </HeaderLayout>
    <ContentLayout>
    MEDIA -- TODO --
    </ContentLayout>
  </Main>
};

export default memo(MediaPage);
