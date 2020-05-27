import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from './DataCard';
import { CloseButton } from './IconButton';
import messages from '../../resources/messages';

const CloseableDataCard = (props) => {
  const { children, title, onClose } = props;
  const { formatMessage } = props.intl;
  return (
    <DataCard>
      <Row>
        <Col lg={12}>
          <CloseButton onClick={onClose} tooltip={formatMessage(messages.close)} backgroundColor="#000000" />
          {title}
        </Col>
      </Row>
      <Row>
        {children}
      </Row>
    </DataCard>
  );
};

CloseableDataCard.propTypes = {
  // from parent
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(CloseableDataCard);
