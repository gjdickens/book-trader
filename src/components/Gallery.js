import React, { Component } from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import Masonry from 'react-masonry-component';

export default ({elements}) => {

  var masonryOptions = {
    transitionDuration: 0
  };

  var childElements = elements.map(function(element){
          return (
               <li className="image-element-class">
                   <img src={element.image_url} />
               </li>
           );
       });



  return (
    <Masonry
       className={'my-gallery-class'}
       elementType={'ul'}
       options={masonryOptions}
       disableImagesLoaded={false}
       updateOnEachImageLoad={false} >
       {childElements}
     </Masonry>
   );
}
