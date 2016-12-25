import React from 'react';
import { Modal, FormGroup, Button, FormControl } from 'react-bootstrap';


export default ({showEditModal, closeModal, selectedBook, handleTitleChange, handleAuthorChange, handleLinkChange, handleDeleteBook, handleEditBook}) => {
    return (
      <Modal className="modal" show={showEditModal} onHide={closeModal}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <FormGroup>
                <FormControl type='text' onChange={handleTitleChange} defaultValue={selectedBook.title}/>
                <FormControl type='text' onChange={handleAuthorChange} defaultValue={selectedBook.author} />
                <FormControl type='text' onChange={handleLinkChange} defaultValue={selectedBook.image_url} />
                <img src={selectedBook.image_url} />
              </FormGroup>
              <Button onClick={handleDeleteBook} className="btn">Delete</Button>
              <Button onClick={handleEditBook} className="btn">Save</Button>
            </Modal.Body>
      </Modal>

    );
}
