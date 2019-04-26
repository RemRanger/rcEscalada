import React, { Component } from 'react';
import AttemptList from "./AttemptList";

class SessionDetail extends Component
{
    state = { session: null }

    getSessionAsync = async () =>
    {
        let response = await fetch(`https://www.remranger.com/escalada-api/session-read.php?id=${this.props.match.params.id}&userId=${this.props.match.params.userId}`);
        let data = await response.json();
        console.log("Getting session data:", data);

        this.setState({ session: data[0] });

        return data;
    }

    getUserAsync = async () =>
    {
        let response = await fetch(`https://www.remranger.com/escalada-api/user-read.php?id=${this.props.match.params.userId}`);
        let data = await response.json();
        console.log("Getting user data:", data);

        this.setState({ user: data[0] });

        return data;
    }

    render()
    {
        if (this.state.session == null)
            this.getSessionAsync();
        if (this.state.user == null)
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
                                <table class="noborder">
                                    <tbody>
                                        <tr class="noalt">
                                            <td class="noborder">Climber:</td>
                                            <td class="noborder">{this.state.user.firstName} {this.state.user.lastName}</td>
                                        </tr>
                                        <tr class="noalt">
                                            <td class="noborder">With:</td>
                                            <td class="noborder">{this.state.session.partnerNames}</td>
                                        </tr>
                                        <tr class="noalt">
                                            <td class="noborder">At:</td>
                                            <td class="noborder">{this.state.session.locationName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>{this.state.session.name}</p>
                                <AttemptList sessionId={this.props.match.params.id} userId={this.props.match.params.userId} />
                            </div>
                        )
                        :
                        ('Loading... please wait')
                }
            </div >
        );
    }
}

export default SessionDetail;