import React, { Component } from 'react';
import AttemptList from "./AttemptList";
import { getApiUrl } from "./Utils";

class SessionDetail extends Component
{
    state =
        {
            session: null,
            hasLoadedSession: false,
            hasLoadedUser: false,
            urlApiRead: `${getApiUrl('session', "read")}?id=${this.props.match.params.id}&userId=${this.props.match.params.userId}`,
            urlApiReadUser: `${getApiUrl('user', "read")}`
        }

    getSessionAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let data = await response.json();
        console.log("Getting session data:", data);

        this.setState({ session: data[0], hasLoadedSession: true });

        return data;
    }

    getUserAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadUser);
        let users = await response.json();
        console.log("Getting user data:", users);

        let user = users.filter(d => d.id == this.props.match.params.userId)[0];
        console.log("User: ", user);

        this.setState({ user: user, hasLoadedUser: true });

        return users;
    }

    render()
    {
        if (!this.state.hasLoadedSession && this.state.session == null)
            this.getSessionAsync();
        if (!this.state.hasLoadedUser && this.state.user == null)
            this.getUserAsync();

        return (
            <div align="center">
                <h1>Session {this.state.session ? ": " + new Date(this.state.session.date).toDateString() : ""}</h1>
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
                                <p>{this.state.session.name}</p>
                                <AttemptList sessionId={this.props.match.params.id} userId={this.props.match.params.userId} />
                            </div>
                        )
                        :
                        this.state.hasLoadedSession && this.state.hasLoadedUser ? ('No results.') : ('Loading... please wait')
                }
            </div >
        );
    }
}

export default SessionDetail;