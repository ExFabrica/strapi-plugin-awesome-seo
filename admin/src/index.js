import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import pluginPermissions from './permissions';
import { StrapiListZoneItem } from './components/injected/strapi-list-zone-item';

import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        /* #5180: redirect on seo page to hide ohter module (green and media) */
        // const component = await import(/* webpackChunkName: "[request]" */ './containers/App');
        const component = await import(/* webpackChunkName: "[request]" */ './containers/SeoPage');

        return component;
      },
      //permissions: pluginPermissions.menu,
    });

    // Create the email settings section
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: { id: getTrad('plugin.name'), defaultMessage: 'Awesome SEO' },
      },
      [
        {
          intlLabel: {
            id: getTrad("plugin.settings.seo.title"),
            defaultMessage: "General settings" // Mandatory but should not be used
          },
          id: 'settings',
          to: `/settings/${pluginId}/seo`,
          Component: async () => {
            const component = await import(
                  /* webpackChunkName: "cms-analyzer-settings-page" */ './containers/Settings/seo'
            );

            return component;
          },
          //permissions: pluginPermissions.settings,
        },
        {
          intlLabel: {
            id: getTrad("plugin.settings.advanced.title"),
            defaultMessage: "Expert settings" // Mandatory but should not be used
          },
          id: 'settings',
          to: `/settings/${pluginId}/expert`,
          Component: async () => {
            const component = await import(
                  /* webpackChunkName: "cms-analyzer-settings-page" */ './containers/Settings/expert'
            );

            return component;
          },
          //permissions: pluginPermissions.settings,
        },
        /* #5182 : desactive seting entries for Media analyzer and Green analyzer BEGIN*/
        // { // Media Anaylzer
        //   intlLabel: {
        //     id: "Media-analyzer-settings",
        //     defaultMessage: 'Media analyzer settings',
        //   },
        //   id: 'settings-media',
        //   to: `/settings/${pluginId}/media`,
        //   Component: async () => {
        //     const component = await import(
        //           /* webpackChunkName: "cms-analyzer-settings-page" */ './containers/Settings/media'
        //     );

        //     return component;
        //   },
        //   //permissions: pluginPermissions.settings,
        // },
        // { // Green Anaylzer
        //   intlLabel: {
        //     id: "Green-analyzer-settings",
        //     defaultMessage: 'Green analyzer settings',
        //   },
        //   id: 'settings-green',
        //   to: `/settings/${pluginId}/green`,
        //   Component: async () => {
        //     const component = await import(
        //           /* webpackChunkName: "cms-analyzer-settings-page" */ './containers/Settings/green'
        //     );

        //     return component;
        //   },
        //   //permissions: pluginPermissions.settings,
        // }
        /* #5182 : desactive seting entries for Media analyzer and Green analyzer END*/
      ]
    );
  },

  bootstrap(app) { 
    // Inject component in Admin
    /*app.injectContentManagerComponent('editView', 'informations', {
      name: 'hal-9000',
      Component: StrapiZoneMarker,
    });

    app.injectContentManagerComponent('listView', 'actions', {
      name: 'hal-9000-list',
      Component: StrapiZoneMarker,
    });

    app.injectContentManagerComponent('listView', 'deleteModalAdditionalInfos', {
      name: 'hal-9000-modal',
      Component: StrapiZoneMarker,
    });*/

    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'hal-9000-links',
      Component: StrapiListZoneItem,
    });

  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
