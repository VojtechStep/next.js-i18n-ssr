import React from 'react';
import PropTypes from 'prop-types';
import withI18next from '/hocs/withI18next';
import { translate } from 'react-i18next';
import { compose, getContext } from 'recompose';

// export default () => <p>Root</p>;
const HomePage = ({ i18n, t }) => <p>Root, {t('home:par')}</p>;

export default compose(withI18next(), translate(['home']))(HomePage);
