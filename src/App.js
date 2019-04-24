import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Home from "./Home";
import Locations from "./Locations";
import Climbers from "./Climbers";
import About from "./About";
import Login from "./Login";

function RouteConfigExample()
{
    return (
        <Router>
            <div style={{ textAlign: 'center' }} >
                <ul class='topnav'>
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


                <Route path="/home" component={Home} />
                <Route path="/locations" component={Locations} />
                <Route path="/climbers" component={Climbers} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route path="/" component={Home} />
         </div>
        </Router>
    );
}

export default RouteConfigExample;
