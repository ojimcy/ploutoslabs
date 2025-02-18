import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './baseModal.css';

const BaseModal = ({
  isOpen,
  toggle,
  title,
  children,
  className = '',
  footerContent,
  showHeader = true,
  size,
  position = 'center', // 'center', 'bottom'
}) => {
  const modalClass = `base-modal ${position}-modal ${className}`;

  return (
    <Modal isOpen={isOpen} toggle={toggle} className={modalClass} size={size}>
      {showHeader && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
      <ModalBody>{children}</ModalBody>
      {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
    </Modal>
  );
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  footerContent: PropTypes.node,
  showHeader: PropTypes.bool,
  size: PropTypes.string,
  position: PropTypes.oneOf(['center', 'bottom']),
};

export default BaseModal;
