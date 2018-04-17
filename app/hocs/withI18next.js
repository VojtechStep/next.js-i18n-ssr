import React from "react";
import PropTypes from "prop-types";
import { I18nextProvider } from "react-i18next";
import { initBrowser } from "/lib/i18n";
import { lifecycle, setPropTypes } from "recompose";

const withI18next = namespaces => ComposedComponent => {
  const WithTranslate = props => {
    const i18n = props.i18n || initBrowser();
    const initialStore = props.i18nInitialStore || {};
    return (
      <I18nextProvider i18n={i18n}>
        <ComposedComponent {...props} />
      </I18nextProvider>
    );
  };

  WithTranslate.propTypes = {
    i18n: PropTypes.object,
  };

  WithTranslate.getInitialProps = async ctx => {
    const composedInitialProps = ComposedComponent.getInitialProps
      ? await ComposedComponent.getInitialProps(ctx)
      : {};

    let i18nOptions = {};
    let i18n;
    let initialStore;
    if (process.browser) {
      // Initialize I18next for browser
      i18n = initBrowser();
    } else {
      // Get I18next instance from request, initialized by the server
      i18n = ctx.req.i18n;
      if (!namespaces) namespaces = i18n.options.ns;
      if (!Array.isArray(namespaces)) namespaces = [namespaces];
      const preloadLang = i18n.languages[0];
      // Preload all resources
      initialStore = i18n.languages.reduce(
        (acc, lang) => ({
          ...acc,
          [lang]: namespaces.reduce(
            (acc, ns) => ({
              ...acc,
              [ns]: (i18n.services.resourceStore.data[preloadLang] || {})[ns],
            }),
            {}
          ),
        }),
        {}
      );
      // Only send selected language to the client
      initialStore.toJSON = () => ({
        [preloadLang]: initialStore[preloadLang],
      });
    }

    return {
      ...composedInitialProps,
      i18n,
      i18nInitialStore: initialStore,
    };
  };

  return WithTranslate;
};

export default withI18next;
