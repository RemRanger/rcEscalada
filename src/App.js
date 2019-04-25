import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Home from "./Home";
import LocationList from "./LocationList";
import LocationDetail from "./LocationDetail";
import UserList from "./UserList";
import About from "./About";
import Login from "./Login";

function App()
{
    return (
        <Router>
            <div style={{ textAlign: 'center' }} >
                <ul className='topnav'>
                    <li>
                        <img src="favicon.ico" alt="Icon" style={{ verticalAlign: 'middle', height: '32px' }} />
                        <span style={{ color: 'skyblue', fontWeight: '800' }}>&nbsp;&nbsp;&Xi;SC&Lambda;L&Lambda;D&Lambda;&nbsp;</span>
                    </li>
                    <li><NavLink to="/home">Home</NavLink></li>
                    <li><NavLink to="/locations">Locations</NavLink></li>
                    <li><NavLink to="/climbers">Climbers</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/login">Login</NavLink></li>
                </ul>
            </div>

            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/locations" component={LocationList} />
            <Route path="/locations/:locationId" component={LocationDetail} />
            <Route path="/climbers" component={UserList} />
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
        </Router>
    );
}

export default App;
