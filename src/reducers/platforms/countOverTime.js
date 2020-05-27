import { FETCH_PLATFORM_COUNT_OVER_TIME } from '../../actions/platformActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';
import { cleanDateCounts } from '../../lib/dateUtil';

const countOverTime = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    supported: true,
  },
  action: FETCH_PLATFORM_COUNT_OVER_TIME,
  handleSuccess: payload => ({
    total: payload.results.total_story_count,
    counts: cleanDateCounts(payload.results.counts),
    supported: payload.supported,
  }),
});

export default countOverTime;
