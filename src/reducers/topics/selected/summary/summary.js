import { combineReducers } from 'redux';
import topMedia from './topMedia';
import storyTotals from './storyTotals';
import mapFiles from './mapFiles';
import timespanFiles from './timespanFiles';
import word2vec from './word2vec';
import word2vecTimespans from './word2vecTimespans';
import attentionDrillDownStories from './attentionDrillDownStories';

const summaryReducer = combineReducers({
  topMedia,
  storyTotals,
  mapFiles,
  timespanFiles,
  word2vec,
  word2vecTimespans,
  attentionDrillDownStories,
});

export default summaryReducer;
