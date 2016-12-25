import React from 'react';
import { Modal, FormGroup, Button, FormControl } from 'react-bootstrap';


export default ({showAddModal, closeModal, selectedBook, handleTitleChange, handleAuthorChange, handleLinkChange, handleAddBook}) => {
    return (
      <Modal className="modal" show={showAddModal} onHide={closeModal}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <FormGroup>
                <FormControl type='text' onChange={handleTitleChange} placeholder="Title" />
                <FormControl type='text' onChange={handleAuthorChange} placeholder="Author" />
                <FormControl type='text' onChange={handleLinkChange} placeholder="Image Link" />
                {selectedBook.image_url ?
                  <img src={selectedBook.image_url} />
                  :
                  <div></div>
                }

              </FormGroup>
              <Button onClick={handleAddBook} className="btn">Add</Button>

            </Modal.Body>
      </Modal>

    );
}
