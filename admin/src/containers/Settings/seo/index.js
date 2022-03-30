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
import { Typography } from '@strapi/design-system/Typography';
import Check from '@strapi/icons/Check';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import Cog from '@strapi/icons/Cog';
import {
  LoadingIndicatorPage,
  useNotification,
} from '@strapi/helper-plugin';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { version as packageVersion } from '../../../../../package.json';

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState();
  const toggleNotification = useNotification();

  const enableResetBtn = false;/* #5195 - use to enable reset BTN */

  //mount
  useEffect(() => {
    SettingsAPI.get().then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
    // unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    const data = await SettingsAPI.set(settings);
    console.log("settings saved", data);
    setSettings(data);
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: { id: getTrad("plugin.settings.button.save.message") },
    });
  };
  const handleReset = async () => {
    setSettings(await SettingsAPI.reset());
  };

  return (
    <>
      <Main labelledBy="title" aria-busy={isLoading}>
        <HeaderLayout
          id="title"
          title={formatMessage({ id: getTrad("plugin.settings.title") })}
          subtitle={formatMessage({ id: getTrad("plugin.settings.version") }, { version: packageVersion })}
          primaryAction={
            isLoading ? <></> :
              <Button onClick={handleSubmit} startIcon={<Check />} size="L" disabled={isSaving} loading={isSaving}>
                {formatMessage({ id: getTrad("plugin.settings.button.save.label") })}
              </Button>
          }
          /* #5195 - enable reset btn if enableResetBtn is true - BEGIN  */
          secondaryAction={(enableResetBtn ?
            <Button variant="tertiary" onClick={handleReset} startIcon={<Cog />}>
              {"Reset"}
            </Button> : "")
          }
        /* #5195 - END  */
        >
        </HeaderLayout>
        {isLoading ? (<LoadingIndicatorPage />)
          : <ContentLayout>
            
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Typography variant="omega" fontWeight="semiBold">
                {formatMessage({ id: getTrad("plugin.settings.seo.description.title") })}
              </Typography>
              <br />
              <Box marginTop={2}>
                <Typography variant="omega">
                  {formatMessage({ id: getTrad("plugin.settings.seo.description.content") })}
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box
                background="neutral0"
                hasRadius
                shadow="filterShadow"
                marginTop={6}
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Stack size={3}>
                  <H2>
                    {formatMessage({
                      id: getTrad("plugin.settings.seo.title")
                    })}
                  </H2>
                  <Grid gap={6}>
                    <GridItem col={12} s={12}>
                      <ToggleInput
                        checked={settings?.seo?.enabled ?? false}
                        hint={formatMessage({ id: getTrad("plugin.settings.seo.enabled.descr") })}
                        label={formatMessage({ id: getTrad("plugin.settings.seo.enabled") })}
                        name="moduleEnabled"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Off',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'On',
                        })}
                        onChange={e => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, enabled: e.target.checked }
                            }
                          });
                        }}
                      />
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <TextInput
                        label={formatMessage({ id: getTrad("plugin.settings.seo.frontEnd") })}
                        name="siteURL"
                        placeholder={formatMessage({ id: getTrad("plugin.settings.seo.frontEnd.placeholder") })}
                        onChange={({ target: { value } }) => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, frontUrl: value }
                            }
                          });
                        }}
                        value={settings?.seo?.frontUrl ?? ""}
                        hint={formatMessage({ id: getTrad("plugin.settings.seo.frontEnd.descr") })}
                      />
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <ToggleInput
                        checked={settings?.seo?.expertMode ?? false}
                        hint={formatMessage({ id: getTrad("plugin.settings.seo.expert.descr") })}
                        label={formatMessage({ id: getTrad("plugin.settings.seo.expert") })}
                        name="expertModeEnabled"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Off',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'On',
                        })}
                        onChange={e => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, expertMode: e.target.checked }
                            }
                          });
                        }}
                      />
                    </GridItem>
                    {/* #5193 : disable enable option for primary frontend url
                    <GridItem col={6} s={12}>
                      <ToggleInput
                        checked={settings && settings.hasOwnProperty("seo") ? settings.seo.frontEnabled : false}
                        hint={'Enable or disable the analyze of this frontend'}
                        label={'Enabled?'}
                        name="siteEnabled"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Off',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'On',
                        })}
                        onChange={e => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, frontEnabled: e.target.checked }
                            }
                          });
                        }}
                      />
                    </GridItem> */}
                    {/* #5193 : disable settings
                    <GridItem col={6} s={12}>
                      <TextInput
                        label="Second Front-end URL to analyze"
                        name="siteURL2"
                        placeholder={formatMessage({ id: getTrad("plugin.settings.panel.setting1.placeholder") })}
                        onChange={({ target: { value } }) => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, frontUrl2: value }
                            }
                          });
                        }}
                        value={settings && settings.seo.frontUrl2 ? settings.seo.frontUrl2 : ""}
                        hint={'The second URL of the frontend you want to analyze'}
                      />
                    </GridItem>
                    <GridItem col={6} s={12}>
                      <ToggleInput
                        checked={settings && settings.hasOwnProperty("seo") ? settings.seo.frontEnabled2 : false}
                        hint={'Enable or disable the analyze of the second frontend'}
                        label={'Enabled?'}
                        name="siteEnabled2"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Off',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'On',
                        })}
                        onChange={e => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, frontEnabled2: e.target.checked }
                            }
                          });
                        }}
                      />
                    </GridItem>
                    <GridItem col={6} s={12}>
                      <TextInput
                        label="Third Front-end URL to analyze"
                        name="siteURL3"
                        placeholder={formatMessage({ id: getTrad("plugin.settings.panel.setting1.placeholder") })}
                        onChange={({ target: { value } }) => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, frontUrl3: value }
                            }
                          });
                        }}
                        value={settings && settings.seo.frontUrl3 ? settings.seo.frontUrl3 : ""}
                        hint={'The URL of the frontend you want to analyze'}
                      />
                    </GridItem>
                    <GridItem col={6} s={12}>
                      <ToggleInput
                        checked={settings && settings.hasOwnProperty("seo") ? settings.seo.frontEnabled3 : false}
                        hint={'Enable or disable the analyze of the third frontend'}
                        label={'Enabled?'}
                        name="siteEnabled3"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Off',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'On',
                        })}
                        onChange={e => {
                          setSettings((prevState) => {
                            return {
                              ...prevState,
                              seo: { ...prevState.seo, frontEnabled3: e.target.checked }
                            }
                          });
                        }}
                      />
                    </GridItem> */}
                  </Grid>
                </Stack>
              </Box>
            </form>
          </ContentLayout>
        }
      </Main>
    </>
  );
};

export default SettingsPage;