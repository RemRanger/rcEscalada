import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { getApiUrl } from "./Utils";
import WaitLoading from "./WaitLoading";

class SessionList extends Component
{
    state =
        {
            sessions: null,
            urlApiRead: `${getApiUrl('session', "read")}?userId=${this.props.match.params.userId}`,
            redirectPath: null
        }

    getSessionsAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let data = await response.json();

        this.setState({ sessions: data });

        return data;
    }

    addSession = () =>
    {
        this.setState({ redirectPath: `/session-edit/0/${this.props.match.params.userId}` });
    }

    render()
    {
        if (this.state.sessions == null)
            this.getSessionsAsync();

        if (this.state.redirectPath == null)
        {
            return (
                <div align="center">
                    <h1>My Sessions</h1>
                    {
                        this.state.sessions
                            ?
                            (
                                <>
                                    <p><button onClick={this.addSession}>Add session</button></p>
                                    <table className="grid">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Location</th>
                                                <th>With</th>
                                                <th>Comment</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.sessions.map(s =>
                                                <tr key={s.id}>
                                                    <td style={{ whiteSpace: 'nowrap' }}><Link to={`/sessions/${s.id}/${this.props.match.params.userId}`}>{new Date(s.date).toDateString()}</Link></td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{s.locationName}</td>
                                                    <td>{s.partnerNames}</td>
                                                    <td>{s.comment}</td>
                                                    <td><Link to={`/session-edit/${s.id}/${this.props.match.params.userId}`}><img src={require('./assets/edit.png')} alt="Edit"/></Link></td>
                                                    <td><Link to={`/session-delete/${s.id}/${this.props.match.params.userId}`}><img src={require('./assets/delete.png')} alt="Delete"/></Link></td>
                                                </tr >)}
                                        </tbody >
                                    </table >
                                </>
                            )
                            :
                        <WaitLoading />
                    }
                    <p><a href={this.state.urlApiRead}>API</a></p>
                </div >
            );
        }
        else
            return <Redirect to={this.state.redirectPath} />
    }
}

export default SessionList;