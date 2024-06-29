import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

export function Separator(props) {
  const { children, ...rest } = props;
  return (
    <Row
      style={{
        height: '1px',
        width: '100%',
        background:
          'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0) 100%)',
      }}
      {...rest}
    >
      {children}
    </Row>
  );
}

Separator.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
};

export function SeparatorVertical(props) {
  const { children, ...rest } = props;
  return (
    <Col
      style={{
        height: 'auto',
        width: '1px',
        background:
          'linear-gradient(180deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0) 100%)',
      }}
      {...rest}
    >
      {children}
    </Col>
  );
}

SeparatorVertical.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
};
