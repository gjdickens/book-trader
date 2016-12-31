// src/components/AthletePreview.js
import React from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem, Badge, Col, Button } from 'react-bootstrap';
if(process.env.WEBPACK) require('./BookPreview.scss');

export default ({handleBookClick, bookData, loggedIn, xsCol, mdCol, requestData}) => {
    return (
      <Col xs={xsCol} md={mdCol} className="card">
        <h4 className="card-title">{bookData.title}</h4>
        <p className="card-author">{bookData.author}</p>
        <img className="card-img" src={bookData.image_url} />
        {loggedIn.isLoggedIn ?
          <div>
          {loggedIn.user !== bookData.username ?
            <div>
            {requestData ?
              <Link to={'/viewRequest/' + requestData._id}><Button block>View Request</Button></Link>
              :
              <Link to={'/request/' + bookData._id}><Button block>Request</Button></Link>
            }
            </div>
            :
            <div>
            {requestData ?
              <Link to={'/viewOffer/' + requestData._id}><Button block>View Offer</Button></Link>
              :
              <Button block onClick={handleBookClick.bind(null, bookData)}>Edit</Button>
            }
            </div>
          }
          </div>
          :
          <div></div>
        }

    </Col>
    );
}
