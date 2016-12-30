import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import BrowseBooks from './components/BrowseBooks';
import BookRequest from './components/BookRequest';
import RequestDetails from './components/RequestDetails';
import Details from './components/Details';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage}/>
    <Route path="/browse" component={BrowseBooks}/>
    <Route path="/details" component={Details}/>
    <Route path="/request/:bookId" component={BookRequest}/>
    <Route path="/viewRequest/:requestId" component={RequestDetails}/>
    <Route path="/viewOffer/:requestId" component={RequestDetails}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
