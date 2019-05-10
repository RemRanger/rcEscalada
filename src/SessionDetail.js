import React, { Component } from 'react';
import AttemptList from "./AttemptList";
import { getApiUrl } from "./Utils";
import WaitLoading from "./WaitLoading";

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

        this.setState({ session: data[0], hasLoadedSession: true });

        return data;
    }

    getUserAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadUser);
        let users = await response.json();

        let user = users.filter(d => parseInt(d.id) === parseInt(this.props.match.params.userId))[0];

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
                                <br />
                                <p>{this.state.session.name}</p>
                                <AttemptList sessionId={this.props.match.params.id} userId={this.props.match.params.userId} />
                            </div>
                        )
                        :
                        <WaitLoading hasLoaded={this.state.hasLoadedSession && this.state.hasLoadedUser} />
                }
            </div >
        );
    }
}

export default SessionDetail;