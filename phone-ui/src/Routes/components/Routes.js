import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

const Main = lazy(() => import('../../Main'));


const Routes = () => (
  <Suspense fallback={<div className='route-loading'><h1>Loading...</h1></div>}>
    <Switch>
      <Route path='/' exact component={Main}/>
    </Switch>
  </Suspense>
);

export default Routes;