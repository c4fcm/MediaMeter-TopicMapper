import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../common/hocs/IntlForm';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';

const localMessages = {
  title: { id: 'topic.story.download.title', defaultMessage: 'Download Story List' },
  intro: { id: 'topic.story.download.intro', defaultMessage: 'A list of top stories is a CSV including basic information like the story URL, publication date, language, media source, and title. Use the form below to pick any additional data you want to download in addition to this. To download all the stories, visit the "Export" tab of the Topic summary.' },
  storyCount: { id: 'topic.story.download.storyCount', defaultMessage: 'Download' },
  storyTags: { id: 'topic.story.download.storyTags', defaultMessage: 'Include themes and subtopics?' },
  platformUrlShares: { id: 'topic.story.download.platformUrlShares', defaultMessage: 'Include this subtopic\'s post, channel, author counts?' },
  socialShares: { id: 'topic.story.download.socialShares', defaultMessage: 'Include share counts for each URL Sharing subtopic?' },
  mediaMetadata: { id: 'topic.story.download.mediaMetadata', defaultMessage: 'Include metadata about the media sources?' },
  options: { id: 'topic.story.download.options', defaultMessage: 'Options' },
  optionsDetails: { id: 'topic.story.download.optionsDetails', defaultMessage: 'Select any additional data you want to innclude in your download (beyond the basic story info).  Each item you add will make the download slower.' },
};

export const FIELD_STORY_LIMIT = 'storyLimit';
export const FIELD_SORT = 'sort';
export const FIELD_STORY_TAGS = 'storyTags';
export const FIELD_MEDIA_METADATA = 'mediaMetadata';
export const FIELD_PLATFORM_URL_SHARES = 'platformUrlShares';
export const FIELD_SOCIAL_SHARES = 'socialShares';

// TODO: figure out how to intl these
const DOWNLOAD_SIZE_OPTIONS = {
  '100 stories': 100,
  '500 stories': 500,
  '1,000 stories': 1000,
  '5,000 stories': 5000,
  '10,000 stories': 10000,
};

// TODO: figure out how to intl these
const DOWNLOAD_SORT_OPTIONS = {
  'sorted by media inlinks': 'inlink',
  'sorted by Facebook shares': 'facebook',
  'sorted by Twitter shares': 'twitter',
  'sorted randomly': 'random',
};

const StoryDownloadDialog = (props) => {
  const { open, onCancel, onDownload, intl, handleSubmit, renderCheckbox, renderSelect, hasTweetCounts,
    usingUrlSharingSubtopic, hasAUrlSharingFocalSet } = props;
  return (
    <form
      className="app-form topic-story-download-form"
      id="topicStoryDownloadForm"
      name="topicStoryDownloadForm"
      onSubmit={handleSubmit(onDownload.bind(this))}
    >
      <Dialog
        className="app-dialog"
        open={open}
        onClose={onCancel}
      >
        <DialogTitle>{intl.formatMessage(localMessages.title)}</DialogTitle>
        <DialogContent>
          <p><FormattedMessage {...localMessages.intro} /></p>
          <Row>
            <Col lg={12}>
              <h4><FormattedMessage {...localMessages.storyCount} /></h4>
              <Field
                name={FIELD_STORY_LIMIT}
                component={renderSelect}
                type="inline"
                fullWidth
              >
                {Object.keys(DOWNLOAD_SIZE_OPTIONS).map(label => (
                  <MenuItem key={DOWNLOAD_SIZE_OPTIONS[label]} value={DOWNLOAD_SIZE_OPTIONS[label]}>{label}</MenuItem>
                ))}
              </Field>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                name={FIELD_SORT}
                component={renderSelect}
                type="inline"
                fullWidth
              >
                {Object.keys(DOWNLOAD_SORT_OPTIONS).map((label) => {
                  // only show twitter option if topic has tweet data
                  if (!hasTweetCounts && (DOWNLOAD_SORT_OPTIONS[label] === 'twitter')) {
                    return '';
                  }
                  return (
                    <MenuItem
                      key={DOWNLOAD_SORT_OPTIONS[label]}
                      value={DOWNLOAD_SORT_OPTIONS[label]}
                    >
                      {label}
                    </MenuItem>
                  );
                })}
              </Field>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <h4><FormattedMessage {...localMessages.options} /></h4>
              <p><small><FormattedMessage {...localMessages.optionsDetails} /></small></p>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                name={FIELD_STORY_TAGS}
                component={renderCheckbox}
                type="inline"
                fullWidth
                label={localMessages.storyTags}
              />
            </Col>
          </Row>
          {usingUrlSharingSubtopic && (
            <Row>
              <Col lg={12}>
                <Field
                  name={FIELD_PLATFORM_URL_SHARES}
                  component={renderCheckbox}
                  type="inline"
                  fullWidth
                  label={localMessages.platformUrlShares}
                />
              </Col>
            </Row>
          )}
          {hasAUrlSharingFocalSet && (
            <Row>
              <Col lg={12}>
                <Field
                  name={FIELD_SOCIAL_SHARES}
                  component={renderCheckbox}
                  type="inline"
                  fullWidth
                  label={localMessages.socialShares}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col lg={12}>
              <Field
                name={FIELD_MEDIA_METADATA}
                component={renderCheckbox}
                type="inline"
                fullWidth
                label={localMessages.mediaMetadata}
              />
            </Col>
          </Row>
        </DialogContent>
        <DialogActions>
          <AppButton
            label={messages.cancel}
            onClick={onCancel}
          />
          <AppButton
            label={messages.download}
            primary
            type="submit"
            form="topicStoryDownloadForm"
          />
        </DialogActions>
      </Dialog>
    </form>
  );
};

StoryDownloadDialog.propTypes = {
  // from parent
  onCancel: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
  hasTweetCounts: PropTypes.bool, // defaults to false
  usingUrlSharingSubtopic: PropTypes.bool,
  hasAUrlSharingFocalSet: PropTypes.bool,
  // from context
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  // from form healper
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'topicStoryDownloadForm',
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    StoryDownloadDialog
  ),
);
