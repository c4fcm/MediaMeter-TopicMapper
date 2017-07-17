import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, SubmissionError, propTypes } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import composeIntlForm from '../../common/IntlForm';
import TopicForm, { TOPIC_FORM_MODE_CREATE } from './TopicForm';
import { fetchTopicSearchResults } from '../../../actions/topicActions';
import { addNotice } from '../../../actions/appActions';
// import { LEVEL_ERROR } from '../../common/Notice';
import messages from '../../../resources/messages';
import { getCurrentDate, getMomentDateSubtraction } from '../../../lib/dateUtil';

const localMessages = {
  title: { id: 'topic.create.setup.title', defaultMessage: 'Step 1: Create A Topic' },
  about: { id: 'topic.create.setup.about',
    defaultMessage: 'Create A Topic then click Preview' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can create a new Topic to add to the MediaCloud system. Copy and paste the keyword query from a Dashboard search into here, and then select dates and media sources and/or collections.  The stories in our database that match will be "seed stories".  Our system will follow links from those stories to find others that match your keyword query, even if they are in sources we don\'t otherwise cover. The combination of stories in our system, and stories that we find via this "spidering" process, will create your Topic.' },
  addCollectionsTitle: { id: 'topic.create.addCollectionsTitle', defaultMessage: 'Select Sources And Collections' },
  addCollectionsIntro: { id: 'topic.create.addCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic:' },
  sourceCollectionsError: { id: 'topic.form.detail.sourcesCollections.error', defaultMessage: 'You must select at least one Source or one Collection to seed this topic.' },
  topicNameAlreadyExists: { id: 'topic.form.detail.nameExists', defaultMessage: 'Sorry this topic name is already taken.' },
};

const formSelector = formValueSelector('topicForm');

const TopicCreate1ConfigureContainer = (props) => {
  const { nextStep } = props;
  const { formatMessage } = props.intl;
  const endDate = getCurrentDate();
  const startDate = getMomentDateSubtraction(endDate, 3, 'months');
  const initialValues = { start_date: startDate, end_date: endDate, max_iterations: 15, buttonLabel: formatMessage(messages.preview) };
  return (
    <Grid>
      <Title render={formatMessage(localMessages.title)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>
      <TopicForm
        form="topicForm"
        initialValues={initialValues}
        onSubmit={nextStep}
        title={formatMessage(localMessages.addCollectionsTitle)}
        intro={formatMessage(localMessages.addCollectionsIntro)}
        mode={TOPIC_FORM_MODE_CREATE}
      />
    </Grid>
  );
};

TopicCreate1ConfigureContainer.propTypes = {
  // from parent
  location: React.PropTypes.object.isRequired,
  initialValues: React.PropTypes.object,
  // form composition
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
  // from state
  currentStep: React.PropTypes.number,
  formData: React.PropTypes.object,
  topicNameSearch: React.PropTypes.object,
  // from dispatch
  nextStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: formSelector(state, 'name', 'solr_seed_query', 'start_date', 'end_date', 'sourceUrls', 'collectionUrls'),
  topicNameSearch: state.topics.create.topicNameSearch,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addNotice: (msg) => {
    dispatch(addNotice(msg));
  },
  goToStep: (values) => {
    const results = dispatch(fetchTopicSearchResults(values.name));
    if (results && results.topics && results.topics.length <= 0) {
      return results;
    }
    const msg = ownProps.intl.formatMessage(localMessages.topicNameAlreadyExists);
    throw new SubmissionError({ name: msg, _error: 'error' });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    nextStep: (values) => {
      // const newErrObj = {};
      dispatchProps.goToStep(1, values)
      .then(() => 1)
      .catch((err) => {
        if (err instanceof SubmissionError) {
          throw err;
        }
      });
    },
  });
}
const validate = (values, props) => {
  const errors = {};
  if (values && values.name && props && props.error) {
    errors.name = 'problem';
  }
  return errors;
};

const reduxFormConfig = {
  form: 'topicForm',
  validate,
  propTypes,
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          TopicCreate1ConfigureContainer
        )
      )
    )
  );
