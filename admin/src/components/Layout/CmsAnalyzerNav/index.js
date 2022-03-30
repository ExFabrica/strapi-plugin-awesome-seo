import React, { useState, useEffect } from 'react';
import SeoIcon from '@strapi/icons/Book';
import MediaIcon from '@strapi/icons/Landscape';
import GreenIcon from '@strapi/icons/Earth';
import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavLink,
} from '@strapi/design-system/SubNav';
import pluginId from '../../../pluginId';
//API Wrapper
import settingsAPI from '../../../api/settings/settings-api-wrapper';

//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';

const AnalyzerNav = () => {
  const [settings, setSettings] = useState();
  const [links, setLinks] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (settings && settings.seo.enabled)
      setLinks((prevState) => [...prevState, {
        id: 1,
        label: 'SEO',
        icon: <SeoIcon />,
        to: `/plugins/${pluginId}/seo`
      }]);
    if (settings && settings.medias.enabled) {
      setLinks((prevState) => [...prevState, {
        id: 2,
        label: 'Media',
        icon: <MediaIcon />,
        to: `/plugins/${pluginId}/media`
      }]);
    }
    if (settings && settings.greenCms.enabled) {
      setLinks((prevState) => [...prevState, {
        id: 3,
        label: 'Green CMS',
        icon: <GreenIcon />,
        to: `/plugins/${pluginId}/green`,
        active: true
      }]);
    }
  }, [settings]);

  useEffect(() => {
    settingsAPI.get().then(data => {
      setSettings(data);
    });
  }, []);

  return links.length > 0 ? <SubNav ariaLabel="Builder sub nav">
    <SubNavHeader label={ formatMessage({id: getTrad("plugin.name")}) } />
    <SubNavSections>
      {links.map(link => <SubNavLink to={link.to} active={link.active} key={link.id} icon={link.icon} >
        {link.label}
      </SubNavLink>)}
    </SubNavSections>
  </SubNav> : <></>
}

export default AnalyzerNav;