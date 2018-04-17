import React from 'react';
import withI18next from '/hocs/withI18next';
import { translate } from 'react-i18next';

const Page2 = () => <p>Page 2</p>;

export default withI18next()(translate(['common'])(Page2));
