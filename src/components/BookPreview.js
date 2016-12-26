// src/components/AthletePreview.js
import React from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem, Badge } from 'react-bootstrap';
if(process.env.WEBPACK) require('./BookPreview.scss');

export default ({handleBookClick, bookData}) => {
    return (
      <div className="col-xs-6 col-md-2 card">
          <a
            href='#'
            onClick={handleBookClick.bind(null, bookData)}>
            <h4 className="card-title">{bookData.title}</h4>
          </a>
          <p className="card-author">{bookData.author}</p>
          <img className="card-img" src={bookData.image_url} />

      </div>
    );
}
