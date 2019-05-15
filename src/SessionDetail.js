import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import AttemptList from "./AttemptList";
import { getApiUrl, formatDate, getUserId } from "./Utils";
import WaitLoading from "./WaitLoading";

class SessionDetail extends Component
{
    constructor(props)
    {
        super(props);

        let userId = getUserId();

        this.state =
            {
                session: null,
                hasLoadedSession: false,
                hasLoadedUser: false,
                userId: userId,
                urlApiRead: `${getApiUrl('session', "read")}?id=${this.props.match.params.id}&userId=${userId}`,
                urlApiReadUser: `${getApiUrl('user', "read")}`,
                redirectPath: userId ? null : "/home"
            }
    }

    getSessionAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let sessions = await response.json();

        let session = sessions[0];
        this.setState({ session: session, hasLoadedSession: true });

        return session;
    }

    getUserAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadUser);
        let users = await response.json();

        let user = users.filter(d => parseInt(d.id) === parseInt(this.state.userId))[0];

        this.setState({ user: user, hasLoadedUser: true });

        return users;
    }

    render()
    {
        if (!this.state.hasLoadedSession && this.state.session == null)
            this.getSessionAsync();
        if (!this.state.hasLoadedUser && this.state.user == null)
            this.getUserAsync();

        if (this.state.redirectPath == null)
        {
            return (
                <div align="center">
                    <h1>Session {this.state.session ? ": " + formatDate(this.state.session.date) : ""}</h1>
                    {
                        this.state.session && this.state.user
                            ?
                            (
                                <div>
                                    {this.state.session.comment}
                                    < br /> <br />
                                    <table >
                                        <tbody>
                                            <tr >
                                                <td >Climber:</td>
                                                <td >{this.state.user.firstName} {this.state.user.lastName}</td>
                                            </tr>
                                            <tr >
                                                <td >With:</td>
                                                <td >{this.state.session.partnerNames}</td>
                                            </tr>
                                            <tr >
                                                <td >At:</td>
                                                <td >{this.state.session.locationName}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                    <p>{this.state.session.name}</p>
                                    <AttemptList sessionId={this.props.match.params.id} userId={this.state.userId} />
                                </div>
                            )
                            :
                            <WaitLoading hasLoaded={this.state.hasLoadedSession && this.state.hasLoadedUser} />
                    }
                </div >
            );
        }
        else
            return <Redirect to={this.state.redirectPath} />
    }
}

export default SessionDetail;