import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { getResultPic } from "./Utils";
import { getApiUrl } from "./Utils";
import WaitLoading from "./WaitLoading";

class AttemptList extends Component
{
    state =
        {
            attempts: null,
            hasLoaded: false,
            urlApiRead: `${getApiUrl('attempt', "read")}?sessionId=${this.props.sessionId}&userId=${this.props.userId}`,
            redirectPath: null
        }

    getAttemptsAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let attempts = null;
        try
        {
            attempts = await response.json();
        }
        finally
        {
            this.setState({ attempts, hasLoaded: true });
        }
        return attempts;
    }

    addAttempt = () =>
    {
        this.setState({ redirectPath: `/attempt-edit/0/${this.props.sessionId}` });
    }

    render()
    {
        if (this.state.attempts == null && !this.state.hasLoaded)
            this.getAttemptsAsync();

        if (this.state.redirectPath == null)
        {
            return (
                <div align="center">
                    <p><button onClick={this.addAttempt}>Add attempt</button></p>
                    {
                        this.state.attempts != null
                            ?
                            (
                                <>
                                    <table className="grid">
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Route</th>
                                                <th align="left">Type</th>
                                                <th>Rating</th>
                                                <th align="left">Location</th>
                                                <th></th>
                                                <th width="16"><img src={require('./assets/result-finish.png')} alt="" /></th>
                                                <th>Comment</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.attempts.filter(r => r.dateUntil == null).map(a =>
                                                <tr key={a.id}>
                                                    <td width="16" style={{ backgroundColor: a.routeColor }}></td>
                                                    <td>{a.routeName}</td>
                                                    <td>{a.routeType}</td>
                                                    <td>{a.routeRating}</td>
                                                    <td>{a.routeSublocation}</td>
                                                    <td>{a.routeName}</td>
                                                    {
                                                        a.result === 0 && a.percentage !== 0
                                                            ?
                                                            <td style={{ color: 'red' }}>{a.percentage || 0}%</td>
                                                            :
                                                            <td align="center">{getResultPic(a.result) != null ? <img src={require('./assets/' + getResultPic(a.result))} alt="" /> : ""}</td>
                                                    }
                                                    <td>{a.comment}</td>
                                                    <td><Link to={`/attempt-edit/${a.id}/${a.sessionId}/${this.props.userId}`}><img src={require('./assets/edit.png')} alt="Edit"/></Link></td>
                                                    <td><Link to={`/attempt-delete/${a.id}/${a.sessionId}/${this.props.userId}`}><img src={require('./assets/delete.png')} alt="Delete"/></Link></td>
                                                </tr>)}
                                        </tbody>
                                    </table>
                                </>
                            )
                            :
                            <WaitLoading hasLoaded={this.state.hasLoaded} />
                    }
                    <p><a href={this.state.urlApiRead}>API</a></p>
                </div >
            );
        }
        else
            return <Redirect to={this.state.redirectPath} />
    }
}


export default AttemptList;