import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Combobox } from 'react-widgets';
import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import SourceSearchResult from './SourceSearchResult';
import { fetchSourceSearch,fetchSourceDetails } from '../../actions/sourceActions';
import * as fetchConstants from '../../lib/fetchConstants.js';
import { Link } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'source.title.query', defaultMessage: 'Search by Keywords' },
};


let ComboboxListItem = React.createClass({
  render() {
    var selectedSource = this.props.item;
    return (
      <Row>
        <Link key={selectedSource.media_id} to={`source/${selectedSource.media_id}/details`} > {selectedSource.name} </Link>
      </Row>
    );
  },
});

class SourceSearchContainer extends React.Component {
  componentDidMount() {
    const { sourceSearchString, fetchStatus, fetchData } = this.props;
    // this.state = sourceSearchString;
  }
  getStyles() {
    const styles = {
      root: {
        backgroundColor: 'lightgray',
        margin: 10,
      },
      contentWrapper: {
        padding: 10,
      },
      input: {
        width: 300,
      },
      list: {
        margin: 10,
        padding: 10,
        width: 300,
        ul: {
          li: {
            listStyleType: 'none',
          },
        },
      },
    };
    return styles;
  }
  handleSearch(handle) {
    const { dispatchSearch } = this.props;
    if (handle !== null && handle !== undefined) {
      this.setState({ value: handle.value });
      dispatchSearch(handle.value);
    }
  }
  gotoDetailPage(handle) {
    const { dispatchGoToDetailPage } = this.props;
    if (handle !== null && handle !== undefined) {
      this.setState({ value: handle.value });
      dispatchGoToDetailPage(handle.value);
    }
  }
  render() {
    const { fetchStatus, fetchData, dispatchSearch } = this.props;
    let { sourceSearchString } = this.props;
    let content = [];
    let linkContent = [];
    const styles = this.getStyles();
    const handleSearch = this.handleSearch();
    if (this.state) {
      sourceSearchString = this.state.value;
    }
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { sources } = this.props;
        
        // searchResults = { content };
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;

    }
    let currentValue = this.state !== null && this.state !== undefined ? this.state.value : '';
    return (
      <Grid style={ styles.root }>
      <Row>
      <Combobox style= { styles.list }
        textField = 'name'
        valueField = 'media_id'
        defaultValue= { sourceSearchString }
        data = { sources }
        onChange = { value => this.handleSearch({ value }) }
        onSelect = { value => this.gotoDetailPage({ value }) }
        itemComponent = { ComboboxListItem }
      />
      </Row>
      <Row> { content } </Row>
      </Grid>
    );
  }
}

SourceSearchContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  sources: React.PropTypes.array,
  sourceSearchString: React.PropTypes.string,
  dispatchGoToDetailPage: React.PropTypes.func,
  dispatchSearch: React.PropTypes.func,
  gotoPage: React.PropTypes.string,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.sourceSearch.fetchStatus,
  sources: state.sources.sourceSearch.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (e) => {
    if (this.state !== null) {   
      dispatch(fetchSourceSearch(this.state));
    }
  },
  dispatchGoToDetailPage: (event) => {
    dispatch(fetchSourceDetails(event.media_id));
  },
  dispatchSearch: (event) => {
    dispatch(fetchSourceSearch(event));
  },
});


export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceSearchContainer));
