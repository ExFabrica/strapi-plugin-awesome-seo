import React, { useRef, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../../utils/getTrad';
import SettingsAPI from '../../../api/settings/settings-api-wrapper';
import { Stack } from '@strapi/design-system/Stack';
import { Main } from '@strapi/design-system/Main';
import { ContentLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { H2 } from '@strapi/design-system/Text';
import { TextInput } from '@strapi/design-system/TextInput';
import { Button } from '@strapi/design-system/Button';
import Plus from '@strapi/icons/Plus';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import {
  CheckPagePermissions,
  LoadingIndicatorPage,
  useNotification,
} from '@strapi/helper-plugin';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { version as packageVersion } from '../../../../../package.json';

const SettingsGreenPage = () => {
  const { formatMessage } = useIntl();
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState();
  const toggleNotification = useNotification();

  //mount
  useEffect(() => {
    SettingsAPI.get().then((data) => {
      console.log("Settings", data);
      setSettings(data);
      setIsLoading(false);
    });
    // unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = await SettingsAPI.set(settings);
    setSettings(data);
    setIsLoading(false);
    toggleNotification({
      type: 'success',
      message: { id: getTrad("plugin.settings.button.save.message") },
    });
  }

  //TODO ADD the RBAC controls
  //<CheckPermissions permissions={permissions.createRole}>
  //</CheckPermissions>

  return (
      <Main labelledBy="title" aria-busy={isLoading}>
        <HeaderLayout
          id="title"
          title={formatMessage({ id: getTrad("plugin.settings.title") })}
          subtitle={formatMessage({ id: getTrad("plugin.settings.version") }, { version: packageVersion })}
          primaryAction={
            <Button onClick={handleSubmit} startIcon={<Plus />} size="L" >
              {formatMessage({ id: getTrad("plugin.settings.button.save.label") })}
            </Button>
          }
        >
        </HeaderLayout>
        {isLoading ? (<LoadingIndicatorPage />)
          : <ContentLayout>
            <form onSubmit={handleSubmit}>
              <Box
                background="neutral0"
                hasRadius
                shadow="filterShadow"
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Stack size={3}>
                <H2>Green CMS Analyzer</H2>
                  <ToggleInput
                        checked={settings && settings.hasOwnProperty("greenCms") ? settings.greenCms.enabled : false}
                        hint={'Enable or disable the green analyze'}
                        label={'Enabled?'}
                        name="siteEnabled"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Disabled',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'Enabled',
                        })}
                        onChange={e => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              greenCms: { ...prevState.greenCms, enabled: e.target.checked }
                            }
                          });
                        }}
                      />
                </Stack>
              </Box>
            </form>
          </ContentLayout>
        }
      </Main>
  );
};

export default SettingsGreenPage;