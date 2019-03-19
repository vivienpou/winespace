import React from 'react';
import { Route, Switch } from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import AdminWineList from './components/AdminWineList';
import AdminWineModif from './components/AdminWineModif';
import AdminWineCreate from './components/AdminWineCreate';
import AdminWineHouse from './components/AdminWineHouse';
import WineDetail from './components/WineDetail';
import AdminPython from './components/AdminPython';
import AdminWineDetail from './components/AdminWineDetail';

import './App.scss';

const App = () => (
  <div className="App">
    <Switch>
      <Route path="/wine-detail" component={WineDetail} />
      <Route path="/admin-comments" component={AdminPython} />
      <Route path="/admin-wine-detail" component={AdminWineDetail} />
      <Route path="/admin-wine-house" component={AdminWineHouse} />
      <Route path="/admin-wine-modif" component={AdminWineModif} />
      <Route path="/admin-wine-create" component={AdminWineCreate} />
      <Route path="/admin-wine-list" component={AdminWineList} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/" exact component={SignIn} />
    </Switch>
  </div>
);
export default App;
