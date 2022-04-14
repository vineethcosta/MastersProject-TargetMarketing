
import './App.css';
import NavigationBar from './components/Navbar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import History from './pages/history'
import Dashboard from './pages/dashboard'
const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" >
        <Dashboard />
      </Route>
      <Route exact path="/login" >
        <Login />
      </Route>
      <Route exact path="/register" >
        <Register />
      </Route>
      <Route exact path="/history" >
        <History />
      </Route>
    </Switch>
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Routing />
      </BrowserRouter>
    </div>
  );
}

export default App;
