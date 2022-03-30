'use strict';
const analyzer = require('@exfabrica/cms-engine-analyzer');

module.exports = ({ strapi }) => {
    const analyseService = () => strapi.plugins["cms-analyzer"].services.analyse;
    const matchService = () => strapi.plugins["cms-analyzer"].services.match;
    const summaryService = () => strapi.plugins["cms-analyzer"].services.summary;
    let nb_error_low=0;
    let nb_error_high=0;

    const getContentTypes = async () => {
        let contentTypes = [];
        Object.values(strapi.contentTypes).map(contentType => {
            if ((contentType.kind === "collectionType" || contentType.kind === "singleType") && !contentType.plugin) {
                contentTypes.push(contentType);
            }
        });
        return contentTypes;
    };
    const getComponentsToPopulate = async () => {
        let contentTypes = await getContentTypes();
        const components = [];

        for (const contentType of contentTypes) {
            components.push({ uid: contentType.uid, components: [], dynamicZones: [] });
            for (const [key, value] of Object.entries(contentType.attributes)) {
                switch (value.type) {
                    case "component":
                        components.filter(item => item.uid === contentType.uid)[0].components.push(key);
                        break;
                    case "dynamiczone":
                        components.filter(item => item.uid === contentType.uid)[0].dynamicZones.push(key);
                        break;
                    case "media":
                        components.filter(item => item.uid === contentType.uid)[0].components.push(key);
                        break;
                    default:
                        break;
                }
            }
        }
        return components;
    };
    const getPopulateObjectForUID = async (uid) => {
        const componentsToPopulate = await getComponentsToPopulate();
        let populate = {};
        const componentToPopulate = componentsToPopulate.filter(item => item.uid === uid);
        if (componentToPopulate && componentToPopulate.length > 0) {
            componentToPopulate[0].components?.forEach(component => {
                populate[component] = { populate: true }
            });
            componentToPopulate[0].dynamicZones?.forEach(dynamicZone => {
                populate[dynamicZone] = { populate: true }
            });
        }
        return populate;
    };
    const getStructure = (item, contentType, type, componentName, zoneName, parentComponentName) => {
        for (const [attributeKey, attributeValue] of Object.entries(contentType.attributes)) {
            switch (attributeValue.type) {
                case "text":
                case "string":
                case "richtext":
                case "number":
                    switch (type) {
                        case "component":
                            item.attributes.push({ key: attributeKey, value: attributeValue, type: "text", container: "component", componentName: componentName });
                            break;
                        case "componentInZone":
                            item.attributes.push({ key: attributeKey, value: attributeValue, type: "text", container: "componentInZone", zone: zoneName, componentName: componentName });
                            break;
                        case "nestedComponentInComponentInZone":
                            item.attributes.push({ key: attributeKey, value: attributeValue, type: "text", container: "nestedComponentInComponentInZone", zone: `${zoneName}|${parentComponentName}`, componentName: componentName });
                            break;
                        case "default":
                            item.attributes.push({ key: attributeKey, value: attributeValue, type: "text", container: "default" });
                            break;
                    }
                case "component":
                    switch (type) {
                        case "default":
                            const component = strapi.components[attributeValue.component];
                            if (component)
                                getStructure(item, component, "component", attributeKey);
                            break;
                        case "componentInZone":
                            const zoneComponentInZone = strapi.components[attributeValue.component];
                            if (zoneComponentInZone)
                                getStructure(item, zoneComponentInZone, "nestedComponentInComponentInZone", attributeKey, zoneName, componentName);
                            break;
                    }
                    break;
                case "enumeration":
                    switch (type) {
                        case "component":
                            for (const enu of attributeValue.enum)
                                item.attributes.push({ key: attributeKey, value: enu, type: "enumeration", container: "component", componentName: componentName });
                            break;
                        case "componentInZone":
                            for (const enu of attributeValue.enum)
                                item.attributes.push({ key: attributeKey, value: enu, type: "enumeration", container: "componentInZone", zone: zoneName, componentName: componentName });
                            break;
                        case "nestedComponentInComponentInZone":
                            for (const enu of attributeValue.enum)
                                item.attributes.push({ key: attributeKey, value: enu, type: "enumeration", container: "nestedComponentInComponentInZone", zone: `${zoneName}|${parentComponentName}`, componentName: componentName });
                            break;
                        case "default":
                            for (const enu of attributeValue.enum)
                                item.attributes.push({ key: attributeKey, value: enu, type: "enumeration", container: "default" });
                            break;
                    }
                    break;
                case "dynamiczone":
                    if (type === "default") {
                        for (const componentName of attributeValue.components) {
                            const component = strapi.components[componentName];
                            getStructure(item, component, "componentInZone", componentName, attributeKey);
                        }
                    }
                    break;
                case "media":
                    switch (type) {
                        case "component":
                            item.medias.push({ key: attributeKey, value: attributeValue, container: "component", componentName: componentName });
                            break;
                        case "componentInZone":
                            item.medias.push({ key: attributeKey, value: attributeValue, container: "componentInZone", zone: zoneName, componentName: componentName });
                            break;
                        case "nestedComponentInComponentInZone":
                            item.medias.push({ key: attributeKey, value: attributeValue, container: "nestedComponentInComponentInZone", zone: `${zoneName}|${parentComponentName}`, componentName: componentName });
                            break;
                        case "default":
                            item.medias.push({ key: attributeKey, value: attributeValue, container: "default" });
                            break;
                    }
                    break;
                default:
                    console.log("unknown", attributeKey, attributeValue);
                    break;
            }
        }
    }
    const getContents = async () => {
        let potentialFields = [];
        let contentTypes = await getContentTypes();

        for (const contentType of contentTypes) {
            let item = {
                uid: contentType.uid,
                kind: contentType.kind,
                attributes: [],
                medias: []
            }
            getStructure(item, contentType, "default");
            potentialFields.push(item);
        }
        return potentialFields.filter(content => content.attributes.length > 0 || content.medias.length > 0);
    };
    const getStrapiDocumentsByContentType = async () => {
        const contentTypes = await getContents();
        let documentsByContentType = [];

        for (const contentType of contentTypes) {
            const populate = await getPopulateObjectForUID(contentType.uid);
            const contentTypeDocuments = await strapi.query(contentType.uid).findMany({
                populate: populate
            });
            if (contentTypeDocuments) {
                documentsByContentType.push({
                    contentType: contentType,
                    documents: Array.isArray(contentTypeDocuments) ? contentTypeDocuments : [contentTypeDocuments],
                });
            }
        }
        return documentsByContentType;
    };
    const getAnalyzedPages = async (payload) => {
        const rs = await analyzer.terminator(payload, ['SEO']);
        let pages = [];
        let summmary= {url:payload.urls[0],nbPage:rs.SEO.length,nbWarning:0,nbError:0}
        for (const seo of rs.SEO) {
            if(cancelRequest) return;

            let page = { uid: seo.result.uid, url: seo.pageInfo.url, tags: [], seoAnalyse: seo.result.results, screenshot: seo.pageInfo.screenshot, depth: seo.pageInfo.depth };
            let stringTags = [];
            const tags = seo.result.tags;
            if (tags) {
                stringTags.push(...tags.title);
                const description = tags.meta.filter(item => item.name === "description");
                if (description && description.length > 0) {
                    description[0].tag = `${description[0].tag} (${description[0].name})`
                    stringTags.push(description[0]);
                }
                stringTags.push(...tags.h1s, ...tags.h2s, ...tags.h3s, ...tags.h4s, ...tags.h5s, ...tags.h6s);
                //stringTags.push(...tags.ps);
                stringTags.push(...tags.imgs)
            }
            page.tags = stringTags;
            pages.push(page);
            // const analyses = JSON.parse(seo.result.results);
            const low = page.seoAnalyse.filter(item =>(item.target === 0 || item.target === 2)&& item.level=="warnings");
            const high = page.seoAnalyse.filter(item =>(item.target === 0 || item.target === 2)&& item.level=="errors");
            summmary.nbWarning += low?.length ?? 0
            summmary.nbError += high?.length ?? 0
        }
        return {pages:pages,summmary:summmary};
    }
    const setFields = (page, document, uid, contentKind, tag, attributeKey, docfieldValue, text, results, isMultipleDoc, componentName, dynamicZoneName) => {
        if (!docfieldValue || !text) return

        const values = isMultipleDoc ? docfieldValue : [docfieldValue]
        values.forEach(val => {
            if ((val.url && text && text.endsWith(val.url))
                || (val.toLowerCase && text.toLowerCase && val.toLowerCase() === text.toLowerCase())) {
                const itemKey = `${uid}_${page.url}`
                const item = results.find(x => x.key === itemKey);
                if (!item){
                    let lang = page.url.match('lang=([\\w\\-]*)');
                    results.push(
                        {
                            key: itemKey,
                            apiName: uid,
                            contentKind:contentKind,
                            frontUrl: page.url,
                            documentId: document.id,
                            documentFields: [{ fieldName: attributeKey, value: val, apiName: uid, tagName: tag.tag, componentName: componentName, dynamicZoneName: dynamicZoneName, status: "active", isMultipleDoc: isMultipleDoc }],
                            seoAnalyse: page.seoAnalyse,
                            screenshot: page.screenshot,
                            tags: page.tags,
                            depth: page.depth,
                            locale:lang?lang[1]:'',
                        });
                }
                else {
                    let field = componentName
                        ? item.documentFields.find(f => f.fieldName === attributeKey && f.apiName === uid && f.value === val && f.tagName === tag.tag && f.componentName === componentName && f.dynamicZoneName === dynamicZoneName)
                        : item.documentFields.find(f => f.fieldName === attributeKey && f.apiName === uid && f.value === val && f.tagName === tag.tag)
                    if (!field) {
                        item.documentFields.push({ fieldName: attributeKey, value: val, apiName: uid, tagName: tag.tag, componentName: componentName, dynamicZoneName: dynamicZoneName, status: "active", isMultipleDoc: isMultipleDoc });
                    }
                }
            }
        });
    };
    const getAttributeComparaison = (results, page, apiName, contentKind, document, attribute, tag) => {
        const attributeKey = attribute.key;
        const isMultipleDoc = !!attribute.value?.multiple
        let docfieldValue = "";
        let text = tag.innerText;
        if (tag.tag.includes("META")) {
            text = tag.content
        } else if (tag.tag === "IMG") {
            text = tag.src
        }
        switch (attribute.container) {
            case "default":
                docfieldValue = document[attributeKey];
                if (docfieldValue)
                    setFields(page, document, apiName, contentKind, tag, attributeKey, docfieldValue, text, results, isMultipleDoc);
                break;
            case "component":
                docfieldValue = document[attribute.componentName] ? document[attribute.componentName][attributeKey] : null;
                if (docfieldValue)
                    setFields(page, document, apiName, contentKind, tag, attributeKey, docfieldValue, text, results, isMultipleDoc, attribute.componentName);
                break;
            case "componentInZone":
                const section = document[attribute.zone];
                if (Array.isArray(section)) {
                    for (const componentChild of section) {
                        docfieldValue = componentChild[attributeKey];
                        if (docfieldValue)
                            setFields(page, document, apiName, contentKind, tag, attributeKey, docfieldValue, text, results, isMultipleDoc, componentChild.__component, attribute.zone);
                    }
                }
                break;
            case "nestedComponentInComponentInZone":
                const componentsName = attribute.zone.split("|");
                const zone = componentsName[0];
                const nestedCompoent = componentsName[1];
                const nestedInnerComponents = document[zone].filter(item => item.__component === nestedCompoent);
                if (nestedInnerComponents && nestedInnerComponents.length > 0) {
                    if (Array.isArray(nestedInnerComponents[0][attribute.componentName])) {
                        nestedInnerComponents[0][attribute.componentName].forEach(element => {
                            docfieldValue = element[attributeKey];
                            if (docfieldValue)
                                setFields(page, document, apiName, contentKind, tag, attributeKey, docfieldValue, text, results, isMultipleDoc, attribute.componentName, attribute.zone);
                        });
                    }
                    else {
                        docfieldValue = nestedInnerComponents[0][attribute.componentName][attributeKey];
                        if (docfieldValue)
                            setFields(page, document, apiName, contentKind, tag, attributeKey, docfieldValue, text, results, isMultipleDoc, attribute.componentName, attribute.zone);
                    }
                }
                break;
            default:
                break;
        }
        return results;
    };
    const filterAnalysesByFieldsCount = (results) => {
        let newResults = {};
        for (const res of results) {
            if (!newResults[res.frontUrl] || newResults[res.frontUrl].documentFields.length < res.documentFields.length) {
                newResults[res.frontUrl] = res;
            }
        }
        return Object.values(newResults);
    }
    const pushAnalyseInStrapiCollection = async (results) => {
        for (const result of results) {
            await analyseService().create({
                key: result.key,
                apiName: result.apiName,
                contentKind: result.contentKind,
                frontUrl: result.frontUrl,
                documentId: result.documentId,
                seoAnalyse: JSON.stringify(result.seoAnalyse ? result.seoAnalyse : {}),
                documentFields: JSON.stringify(result.documentFields ? result.documentFields : {}),
                screenshot: result.screenshot,
                depth: result.depth,
                tags: JSON.stringify(result.tags ? result.tags : {}),
                locale:result.locale,
                isChecked: false,
            });
        }
    };
    const FixMatchesErrors = (results) => {
        let finalResults = {};
        // Group by apiName
        results.forEach(current => {
            if (finalResults[current.apiName]) {
                finalResults[current.apiName].push(current);
            } else {
                finalResults[current.apiName] = [current];
            }
        })
        for (const result in finalResults) {
            const treeFields = finalResults[result].map(item => item.documentFields);
            const flattenFields = treeFields.flat();

            let generatedKeys = [];
            flattenFields.forEach(item => {
                if (!item.dynamicZoneName)
                    generatedKeys.push({ key: `${item.tagName}|${item.fieldName}|${item.componentName}`, items: item });
            });
            let treeKeys = {};
            // Group by "key"
            generatedKeys.forEach(current => {
                if (treeKeys[current.key]) {
                    treeKeys[current.key].push(current);
                } else {
                    treeKeys[current.key] = [current];
                }
            })
            if (finalResults[result].length) {
                for (const key in treeKeys) {
                    if (treeKeys[key].length < finalResults[result].length / 2) {
                        const explodedKey = key.split("|");
                        const tagName = explodedKey[0];
                        const fieldName = explodedKey[1];
                        const componentName = explodedKey[2];
                        for (const analyse of finalResults[result]) {
                            analyse.documentFields.forEach(item => {
                                const compare = componentName === "undefined"
                                    ? item.tagName === tagName && item.fieldName === fieldName
                                    : item.tagName === tagName && item.fieldName === fieldName && item.componentName === componentName;
                                if (compare) {
                                    item.status = "error";
                                }
                            });
                        }
                    }
                }
            }
        }
    };
    const pushMatchesInStrapiCollection = async (results) => {
        let fields = [];
        for (const result of results)
            fields.push(...result.documentFields);
        fields = fields.filter((val, idx, arr) => // Unique
            arr.findIndex(item => item.componentName === val.componentName && item.tagName === val.tagName && item.apiName === val.apiName && item.fieldName === val.fieldName)
            === idx)

        for (const field of fields) {
            await matchService().create({
                apiName: field.apiName,
                componentName: field.componentName,
                tagName: field.tagName,
                fieldName: field.fieldName,
                dynamicZoneName: field.dynamicZoneName,
                status: field.status,
                isMultipleDoc: field.isMultipleDoc,
            });
        }
    };
    const pushSummary = async (summary, user, date) => {
        await summaryService().create({
            frontUrl: summary.url,
            nbUrl: summary.nbPage,
            nbErrorLow: summary.nbWarning,
            nbErrorHigh: summary.nbError,
            user: user,
            date: date,
            });
    };
    const clear = async () => {
        await analyseService().deleteAll();
        await matchService().deleteAll();
    };
    const runRT = async (payload) => {
        return analyzer.runSEORealTimeRulesAnalyse(payload);
    };
    const analysisState = async () => {
        let state = await analyzer.analysisState()
        if (state) {
            state.isRunning = state.isRunning || isSeoAggregationRunning
        }
        return state
    }
    const cancel = () => {
        cancelRequest = true;
        analyzer.cancelAnalysis();
    }

    let isSeoAggregationRunning = false
    let cancelRequest = false;
    const run = async (payload) => {
        console.log("received payload", payload);
        isSeoAggregationRunning = true
        cancelRequest = false;
        try {
            let results = [];
            await clear();

            // Get pages from analyzer
            const analyzedPages = await getAnalyzedPages(payload, ["SEO"]);
            if(cancelRequest) return;

            const pages = analyzedPages.pages;
            const summary = analyzedPages.summmary;
            // Get documents and attributes sorted by apiNameges(url);
            const strapiDocumentsByContentType = await getStrapiDocumentsByContentType();

            /************ FIRST PASS: Single Type *****************/
            const strapiSingleDocumentsByContentType = strapiDocumentsByContentType.filter(item => item.contentType.kind == "singleType");
            // Iterate on pages and documents to match data
            for (const page of pages) {
                for (const tag of page.tags) {
                    for (const documentByContentType of strapiSingleDocumentsByContentType) {
                        for (const document of documentByContentType.documents) {
                            for (const attribute of documentByContentType.contentType.attributes) {
                                results = getAttributeComparaison(results, page, documentByContentType.contentType.uid, documentByContentType.contentType.kind, document, attribute, tag);
                            }
                            for (const media of documentByContentType.contentType.medias) {
                                results = getAttributeComparaison(results, page, documentByContentType.contentType.uid, documentByContentType.contentType.kind, document, media, tag);
                            }
                        }
                    }
                }
            }
            if(cancelRequest) return;

            //Get the occurence with the bigger document fieldsets.
            results = filterAnalysesByFieldsCount(results);
            //Put founded data in plugin collection
            await pushAnalyseInStrapiCollection(results);
            //Detect and fix some errors
            FixMatchesErrors(results);
            //Work on result to extract relations ships between front tags and Strapi fields
            await pushMatchesInStrapiCollection(results);

            /************ SECOND PASS: Collection Type *****************/
            results = [];
            const strapiCollectionDocumentsByContentType = strapiDocumentsByContentType.filter(item => item.contentType.kind == "collectionType");
            //Remove single type from analyzed page.
            const analysesUrls = new Set((await analyseService().findMany()).map(x => x.frontUrl))
            const pagesToBrowse = pages.filter(p => !analysesUrls.has(p.url))
            for (const page of pagesToBrowse) {
                for (const tag of page.tags) {
                    for (const documentByContentType of strapiCollectionDocumentsByContentType) {
                        for (const document of documentByContentType.documents) {
                            for (const attribute of documentByContentType.contentType.attributes) {
                                results = getAttributeComparaison(results, page, documentByContentType.contentType.uid, documentByContentType.contentType.kind, document, attribute, tag);
                            }
                            for (const media of documentByContentType.contentType.medias) {
                                results = getAttributeComparaison(results, page, documentByContentType.contentType.uid, documentByContentType.contentType.kind, document, media, tag);
                            }
                            if(cancelRequest) return;
                        }
                    }
                }
            }
            //Get the occurence with the bigger document fieldsets.
            results = filterAnalysesByFieldsCount(results);
            //Put founded data in plugin collection
            await pushAnalyseInStrapiCollection(results);
            //Detect and fix some errors
            FixMatchesErrors(results);
            //Work on result to extract relations ships between front tags and Strapi fields
            await pushMatchesInStrapiCollection(results);

            let user = payload.user.firstname+' '+(payload.user.lastname??'')+ (payload.user.username? '('+payload.user.username+')':'');
            pushSummary(summary,user,new Date());
        }
        catch (ex) {
            console.debug("Error", ex);
            return Promise.reject({ success: false, error: ex });
        } finally {
            isSeoAggregationRunning = false
        }
        return Promise.resolve({ success: true })
    };
    return {
        run,
        runRT,
        analysisState,
        cancel,
    };
}