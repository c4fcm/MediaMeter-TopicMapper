import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import GridList from 'material-ui/GridList';

const QueryPickerItem = (props) => {
  const { query, isEditable, selectThisQuery } = props;
  let nameInfo = null;
  if (isEditable) {
    nameInfo = <TextField id="name" value={query.label} />;
  } else {
    nameInfo = <h2>{query.label}</h2>;
  }
  return (
    <GridList className="query-picker-item" cols={3} onClick={() => selectThisQuery()}>
      {nameInfo}
    </GridList>
  );
};

QueryPickerItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isEditable: React.PropTypes.bool.isRequired,
  selectThisQuery: React.PropTypes.func,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerItem
  );
