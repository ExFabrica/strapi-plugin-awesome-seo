import React, { useState, useEffect } from 'react';
import { StrapiUIDecorator } from './strapi-ui-decorator'
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
//API Wrapper
const contentAnalyzerAPI = require("../../api/seo/seo-api-wrapper").default;
const settingsAPI = require("../../api/settings/settings-api-wrapper").default;
import { Portal } from '@strapi/design-system/Portal';

export const StrapiListZoneItem = () => {
  const { slug } = useCMEditViewDataManager();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    settingsAPI.get().then(data => {
      if (data.seo.enabled) {
        contentAnalyzerAPI.getMatches().then(result => {
          if (result) {
            const slugs = Array.from(new Set(result.map(x => x.apiName))) // Unique
            setIsVisible(slugs.includes(slug));
          }
        });
      }
    });
  }, []);

  return (
    isVisible ?
      <>
        {/*inject the strapi CMS-Analyzer decorator*/}
        {
          <Portal>
            <StrapiUIDecorator />
          </Portal>
        }
      </>
      : <></>
  );
};