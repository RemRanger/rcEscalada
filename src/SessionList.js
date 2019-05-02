import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { getApiUrl } from "./Utils";

class SessionList extends Component
{
    state =
        {
            sessions: null,
            urlApiRead: `${getApiUrl('session', "read")}?userId=${this.props.match.params.userId}`
        }

    getSessionsAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let data = await response.json();
        console.log("Getting sessions data:", data);

        this.setState({ sessions: data });

        return data;
    }

    render()
    {
        if (this.state.sessions == null)
            this.getSessionsAsync();

        console.log("Rendering, this.state.sessions:", this.state.sessions);
        return (
            <div align="center">
                <h1>My Sessions</h1>
                {
                    this.state.sessions
                        ?
                        (
                            <table className="grid">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>With</th>
                                        <th>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.sessions.map(s =>
                                        <tr key={s.id}>
                                            <td style={{ whiteSpace: 'nowrap' }}><Link to={`/sessions/${s.id}/${this.props.match.params.userId}`}>{new Date(s.date).toDateString()}</Link></td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{s.locationName}</td>
                                            <td>{s.partnerNames}</td>
                                            <td>{s.comment}</td>
                                            {/*<td><a [routerLink]="['/session-edit', s.id, userId]"><img src="./assets/edit.png"></a></td>
                                            <td><a [routerLink]="['/session-delete', s.id, userId]"><img src="./assets/delete.png"></a></td>*/}
                                        </tr >)}
                                </tbody >
                            </table >
                        )
                        :
                        ('Loading... please wait')
                }
                <p><a href={this.state.urlApiRead}>API</a></p>
            </div >
        );
    }
}

export default SessionList;