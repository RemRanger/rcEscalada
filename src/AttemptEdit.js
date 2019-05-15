import React, { Component } from 'react';
import { getApiUrl, formatDate, getUserId } from "./Utils";
import { Redirect } from "react-router-dom";
import WaitLoading from "./WaitLoading";

class AttemptEdit extends Component
{
    constructor(props)
    {
        super(props);

        let percentages = [];
        for (let p = 0; p <= 95; p += 5)
            percentages.push(p);

        let userId = getUserId();

        this.state =
            {
                attempt: null,
                session: null,
                routes: null,
                hasLoadedAttempt: false,
                hasLoadedSession: false,
                userId: userId,
                urlApiReadSession: `${getApiUrl("session", "read")}?id=${this.props.match.params.sessionId}&userId=${userId}`,
                urlApiRead: `${getApiUrl("attempt", "read")}?id=${this.props.match.params.id}`,
                urlApiCreate: getApiUrl("attempt", "create"),
                urlApiUpdate: getApiUrl("attempt", "update"),
                percentages: percentages,
                redirectPath: userId ? null : "/home"
            }
    }

    getAttemptAsync = async () =>
    {
        let attempt = null;
        if (parseInt(this.props.match.params.id) === 0)
            attempt =
                {
                    id: 0,
                    userId: this.state.userId,
                    sessionId: this.props.match.params.sessionId,
                    routeId: 0,
                    comment: "",
                    result: 0,
                    percentage: 0,
                    sessionDate: new Date(),
                    locationName: "Bob"

                };
        else
        {
            let response = await fetch(this.state.urlApiRead);
            let attempts = await response.json();

            attempt = attempts[0];
        }

        this.setState({ attempt, hasLoadedAttempt: true });

        return attempt;
    }

    getSessionAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadSession);
        let sessions = await response.json();
        let session = sessions[0];

        if (session)
        {
            this.getRoutesAsync(`${getApiUrl("route", "read")}?locationId=${session.locationId}`, session);
            this.setState({ session, hasLoadedSession: true });
        }

        return session;
    }

    getRoutesAsync = async (apiUrl, session) =>
    {
        let response = await fetch(apiUrl, { method: 'get' });
        let routes = null;
        try
        {
            routes = await response.json();
            if (routes)
                routes = routes.filter(r => r.dateFrom <= session.date && (r.dateUntil == null || r.dateUntil >= session.date));
        }
        finally
        {
            this.setState({ routes });
        }
        return routes;
    }

    handleChange = (event) =>
    {
        if (this.state.attempt !== null)
        {
            let attempt = this.state.attempt;
            let name = event.target.name;
            let value = event.target.value;
            attempt[name] = value;
            this.setState({ attempt });
        }
    }

    isValid()
    {
        return this.state.attempt != null && this.state.attempt.userId > 0 && this.state.attempt.sessionId > 0 && this.state.attempt.routeId > 0;
    }

    handleSubmit = (event) =>
    {
        event.preventDefault();

        this.submitAttemptAsync();
    }

    submitAttemptAsync = async () =>
    {
        let formData = new FormData();
        if (this.state.attempt.id > 0)
            formData.append('id', this.state.attempt.id);
        formData.append('userId', this.state.attempt.userId);
        formData.append('sessionId', this.props.match.params.sessionId);
        formData.append('routeId', this.state.attempt.routeId);
        formData.append('comment', this.state.attempt.comment);
        formData.append('result', this.state.attempt.result);
        formData.append('percentage', this.state.attempt.percentage);

        let response = null;
        if (parseInt(this.state.attempt.id) === 0)
        {
            response = await fetch(this.state.urlApiCreate,
                {
                    method: 'post',
                    body: formData
                });
        }
        else
        {
            response = await fetch(this.state.urlApiUpdate,
                {
                    method: 'post',
                    body: formData
                });
        }
        let data = null;
        try
        {
            data = await response.json();
            this.goBack();
        }
        finally
        {
        }
        return data;
    }

    goBack = () =>
    {
        this.setState({ redirectPath: `/sessions/${this.props.match.params.sessionId}` });
    }

    render()
    {
        if (!this.state.attempt && !this.state.hasLoadedAttempt)
            this.getAttemptAsync();
        if (!this.state.session && !this.state.hasLoadedSession)
            this.getSessionAsync();

        if (!this.state.redirectPath)
        {
            if (this.state.attempt && this.state.session && this.state.routes)
            {
                return (
                    <div align="center">
                        <h1>{this.state.attempt.id > 0 ? "Edit" : "Add"} attempt</h1>
                        <form method="post" novalidate onSubmit={this.handleSubmit} >
                            <table>
                                <tbody>
                                    <tr>
                                        <td align="center">
                                            <label>{formatDate(this.state.session.date)} at {this.state.session.locationName}</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style={{ border: 'outset', borderWidth: '1px', height: '400px', overflowY: 'auto' }}>
                                                <table>
                                                    <tbody>
                                                        {this.state.routes.map(r =>
                                                            <tr key={r.id} style={{
                                                                color: parseInt(r.id) === parseInt(this.state.attempt.routeId) ? 'white' : '',
                                                                backgroundColor: parseInt(r.id) === parseInt(this.state.attempt.routeId) ? 'black' : '',
                                                                opacity: parseInt(r.id) === parseInt(this.state.attempt.routeId) ? '0.5' : ''
                                                            }}>
                                                                <td><input type="radio" name="routeId" value={r.id} checked={parseInt(r.id) === parseInt(this.state.attempt.routeId)} onChange={this.handleChange} /></td>
                                                                <td style={{ width: '16px', backgroundColor: r.color }}></td>
                                                                <td>{r.name}</td>
                                                                <td>{r.type}</td>
                                                                <td>{r.rating}</td>
                                                                <td>{r.sublocation}</td>
                                                            </tr>)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            Completed:
                                        <select name="result" value={this.state.attempt.result} onChange={this.handleChange}>
                                                <option value="0">Partly:</option>
                                                <option value="1">With fall or block</option>
                                                <option value="2">In one go</option>
                                            </select>
                                            {parseInt(this.state.attempt.result) === 0 ?
                                                (<span >
                                                    <select name="percentage" value={this.state.attempt.percentage} onChange={this.handleChange}>
                                                        {this.state.percentages.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select> %
                                        </span>)
                                                :
                                                ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <textarea rows="4" cols="50" name="comment" value={this.state.attempt.comment} onChange={this.handleChange} />
                                        </td >
                                    </tr >
                                </tbody>
                            </table >
                            <br />
                            <button style={{ width: '100px' }} type="submit" disabled={!this.isValid()} >OK</button >&nbsp;&nbsp;
                        <input type="button" value="Cancel" style={{ width: '100px' }} onClick={this.goBack} />
                        </form>
                    </div >)
            }
            else
                return <WaitLoading />
        }
        else
            return <Redirect to={this.state.redirectPath} />;
    }
}

export default AttemptEdit;