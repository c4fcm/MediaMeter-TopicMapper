import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { schemeCategory10 } from 'd3';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { WarningNotice } from '../../common/Notice';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';
import SearchForm from './SearchForm';
import { getDateRange, solrFormat, PAST_MONTH } from '../../../lib/dateUtil';
import { DEFAULT_COLLECTION, autoMagicQueryLabel, serializeQueriesForUrl } from '../../../lib/explorerUtil';
import { emptyString } from '../../../lib/formValidators';
import ExplorerMarketingFeatureList from './ExplorerMarketingFeatureList';
import SystemStatsContainer from '../../common/statbar/SystemStatsContainer';
import messages from '../../../resources/messages';
import Masthead from '../../common/header/Masthead';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';

const localMessages = {
  title: { id: 'explorer.intro.title', defaultMessage: 'Explorer' },
  subtitle: { id: 'explorer.intro.subtitle', defaultMessage: 'Explore Online News with Media Cloud' },
  description: { id: 'explorer.intro.description', defaultMessage: 'Use the Media Cloud Explorer to search half a billion stories from more than 50,000 sources. We pull in stories from online news media, blogs, and other sources to let you research media attention to issues you are interested in. Track shifts in media attention, identify competing media narratives, compare coverage in different media sectors - these are all tasks Media Cloud can help you with.' },
  loginTitle: { id: 'explorer.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
  security: { id: 'login.securitynotice', defaultMessage: 'We recently noticed a security problem and reset all passwords. We emailed everyone a link to reset your password. <br />If you can\'t find that email, <a href={link}> reset your password here.</a>' },
};

const Homepage = ({ isLoggedIn, onKeywordSearch, storyCount }) => (
  <div className="homepage">
    <Masthead
      nameMsg={messages.explorerToolName}
      descriptionMsg={messages.explorerToolDescription}
      link="https://mediacloud.org/tools/"
    />
    <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
      <div className="search-section">
        <Grid>
          <Row>
            <Col lg={12}>
              <SearchForm onSearch={val => onKeywordSearch(val, isLoggedIn)} storyCount={storyCount} />
            </Col>
          </Row>
        </Grid>
      </div>
    </Permissioned>
    { !isLoggedIn && (
      <Grid>
        <Row>
          <Col lg={1} />
          <Col lg={5}>
            <h1><FormattedMessage {...localMessages.subtitle} /></h1>
            <p><FormattedMessage {...localMessages.description} /></p>
          </Col>
          <Col lg={1} />
          <Col lg={4}>
            <WarningNotice>
              <br />
              <FormattedHTMLMessage {...localMessages.security} values={{ link: '#/user/request-password-reset' }} /><br />
            </WarningNotice>
            <DataCard leftBorder>
              <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
              <LoginForm />
            </DataCard>
          </Col>
        </Row>
      </Grid>
    )}
    <ExplorerMarketingFeatureList />
    <Grid>
      <SystemStatsContainer />
    </Grid>
  </div>
);

Homepage.propTypes = {
  intl: PropTypes.object.isRequired,
  // from context
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired, // params from router
  onKeywordSearch: PropTypes.func.isRequired,
  // from state
  isLoggedIn: PropTypes.bool.isRequired,
  storyCount: PropTypes.number,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  storyCount: state.system.stats.stats.total_stories,
});

const mapDispatchToProps = dispatch => ({
  onKeywordSearch: (values, isLoggedIn) => {
    let urlParamString;
    const keyword = emptyString(values.keyword) ? '' : values.keyword;
    if (isLoggedIn) {
      const defaultDates = getDateRange(PAST_MONTH);
      const queries = [{
        q: keyword,
        startDate: solrFormat(defaultDates.start),
        endDate: solrFormat(defaultDates.end),
        color: schemeCategory10[0],
        collections: [DEFAULT_COLLECTION],
        sources: [],
      }];
      queries[0].label = autoMagicQueryLabel(queries[0]);
      urlParamString = `search?qs=${serializeQueriesForUrl(queries)}`;
    } else {
      const queries = [{ q: keyword }];
      urlParamString = `demo/search?qs=${serializeQueriesForUrl(queries)}`;
    }
    dispatch(push(`/queries/${urlParamString}&auto=true`));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    Homepage
  )
);
