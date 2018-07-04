import { FETCH_STORY_OUTLINKS } from '../../actions/storyActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const outlinks = createAsyncReducer({
  initialState: {
    stories: [],
    links_ids: {},
  },
  action: FETCH_STORY_OUTLINKS,
});

export default outlinks;
