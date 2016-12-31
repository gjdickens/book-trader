import React from 'react';
import { Modal, FormGroup, Button, FormControl, Col } from 'react-bootstrap';


export default ({showEditModal, closeModal, selectedBook, handleTitleChange, handleAuthorChange, handleLinkChange, handleDeleteBook, handleEditBook}) => {
    return (
      <Modal className="modal" show={showEditModal} onHide={closeModal}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <FormGroup>
                <Col xs={2}>Title:</Col>
                <Col xs={10}>
                  <FormControl type='text' onChange={handleTitleChange} defaultValue={selectedBook.title}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={2}>Author:</Col>
                <Col xs={10}>
                  <FormControl type='text' onChange={handleAuthorChange} defaultValue={selectedBook.author} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={2}>Image URL:</Col>
                <Col xs={10}>
                  <FormControl type='text' onChange={handleLinkChange} defaultValue={selectedBook.image_url} />
                </Col>
              </FormGroup>
              <div className="modal-image">
              <Col xs={2}></Col>
              <img src={selectedBook.image_url}  />
              </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer" closeButton>
              <div className="text-center">
              <Button onClick={handleDeleteBook} className="btn">Delete</Button>
              <Button onClick={handleEditBook} className="btn">Save</Button>
              </div>
            </Modal.Footer>
      </Modal>

    );
}
