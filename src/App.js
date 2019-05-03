import React, { Component } from "react";
import { HashRouter, Route, Redirect, NavLink } from "react-router-dom";
import Home from "./Home";
import LocationList from "./LocationList";
import LocationDetail from "./LocationDetail";
import UserList from "./UserList";
import About from "./About";
import Login from "./Login";
import SessionList from "./SessionList";
import SessionDetail from "./SessionDetail";

class App extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { user: null }
    }

    handleLoggedIn = (newUser) =>
    {
        this.setState({ user: newUser });
        console.log("App user:", newUser);
    }

    logout = () =>
    {
        this.setState({ user: null });
    }

    render()
    {
        return (
            <HashRouter basename='/'>
                <div>
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
                            {
                                this.state.user == null
                                    ?
                                    (<li><NavLink to="/login">Login</NavLink></li>)
                                    :
                                    (
                                        <>
                                            <li><NavLink to={`/sessions/${this.state.user.id}`}>My sessions</NavLink></li>
                                            <li><a href="#" onClick={this.logout}>Logout {this.state.user.firstName}</a></li>
                                        </>
                                    )}
                        </ul>
                    </div>

                    <Route exact path="/" render={() => (<Redirect to="/home" />)} />
                    <Route path="/home" component={Home} />
                    <Route exact path="/locations" component={LocationList} />
                    <Route path="/locations/:id" component={LocationDetail} />
                    <Route path="/climbers" component={UserList} />
                    <Route path="/about" component={About} />
                    <Route path="/login" render={(props) => <Login onLoggedIn={this.handleLoggedIn} />} />
                    <Route exact path="/sessions/:userId" component={SessionList} />
                    <Route path="/sessions/:id/:userId" component={SessionDetail} />
                </div>
            </HashRouter>
        );
    }
}

export default App;
