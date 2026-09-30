import React from 'react';
import { Modal } from 'react-bootstrap';

// Reusable modal for confirming document deletion
const DeleteModal = ({ show, onHide, onConfirm, title, deleting }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
          Confirm Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: 'var(--muted)', fontSize: '14px' }}>
        Are you sure you want to delete {title ? `"${title}"` : 'this document'}? All files will be removed.
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn-outline-custom" onClick={onHide}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-danger-confirm"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
