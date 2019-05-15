import React, { Component } from "react";
import { HashRouter, Route, Redirect, NavLink } from "react-router-dom";
import Home from "./Home";
import LocationList from "./LocationList";
import LocationDetail from "./LocationDetail";
import UserList from "./UserList";
import About from "./About";
import Login from "./Login";
import Register from "./Register";
import SessionList from "./SessionList";
import SessionDetail from "./SessionDetail";
import SessionEdit from "./SessionEdit";
import SessionDelete from "./SessionDelete";
import AttemptEdit from "./AttemptEdit";
import AttemptDelete from "./AttemptDelete";
import { getApiUrl, getUserId, setUserId } from "./Utils";

class App extends Component
{
    constructor(props)
    {
        super(props);

        let userId = getUserId();

        this.state = { userId: userId, user: null }

        this.updateUser(userId);
    }

    updateUser = async (userId) =>
    {
        let response = await fetch(getApiUrl("user", "read"));
        let users = await response.json();

        let user = users.filter(d => parseInt(d.id) === parseInt(userId))[0];

        this.setState({ user: user });
    }

    handleLoggedIn = (user) =>
    {
        let userId = user ? user.id : null;
        setUserId(userId);
        this.setState({ user: user });
    }

    logout = () =>
    {
        setUserId(null);
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
                                            <li><NavLink to={"/sessions"}>My sessions</NavLink></li>
                                            <li><a href="/home" onClick={this.logout}>Logout {this.state.user.firstName}</a></li>
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
                    <Route path="/register" component={Register} />
                    <Route exact path="/sessions" component={SessionList} />
                    <Route path="/sessions/:id/:userId" component={SessionDetail} />
                    <Route path="/session-edit/:id/:userId" component={SessionEdit} />
                    <Route path="/session-delete/:id/:userId" component={SessionDelete} />
                    <Route path="/attempt-edit/:id/:sessionId/:userId" component={AttemptEdit} />
                    <Route path="/attempt-delete/:id/:sessionId/:userId" component={AttemptDelete} />
                    }
                </div>
            </HashRouter>
        );
    }
}

export default App;
