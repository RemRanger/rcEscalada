import React, { Component } from 'react';
import { getResultPic, getUserId } from "./Utils";
import { getApiUrl, formatDate } from "./Utils";
import { Link } from "react-router-dom";
import WaitLoading from "./WaitLoading";

class Attempt
{
    id: number;
    result: number;
    percentage: number;
    comment: string;
    routeId: number;
    routeColor: string;
    routeName: string;
    routeType: string;
    routeRating: string;
    routeSublocation: string;
    routeDateUntil: Date;
    routePictureFileName: string;
    locationId: number;
    locationName: string;
    sessionId: number;
    sessionDate: Date;
    userId: number;
    userFirstName: string;
    userLastName: string;
}

class AttemptGroup
{
    sessionId: number;
    userId: number;
    attempts: Attempt[] = [];
}

class ActivityList extends Component
{
    state =
        {
            attempts: null,
            hasLoaded: false,
            urlApiRead: getApiUrl('attempt', "read"),
            userId: getUserId()
        }

    getActivitysAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let data = null;
        try
        {
            data = await response.json();
        }
        finally
        {
            this.setState({ attempts: data, hasLoaded: true });
        }

        return data;
    }

    getAttemptGroups(): AttemptGroup[]
    {
        let attemptGroups: AttemptGroup[] = [];
        let lastSessionId = null;
        let lastUserId = null;
        let attemptGroup: AttemptGroup;
        for (let attempt of this.state.attempts.sort((a, b) => { return b.userId - a.userId }).sort((a, b) => { return b.sessionId - a.sessionId }))
        {
            if (attemptGroup == null || lastSessionId == null || attempt.sessionId !== lastSessionId || attempt.userId !== lastUserId)
            {
                attemptGroup = new AttemptGroup()
                attemptGroup.sessionId = attempt.sessionId;
                attemptGroup.userId = attempt.userId;
                attemptGroups.push(attemptGroup);
            }
            attemptGroup.attempts.push(attempt);

            lastSessionId = attempt.sessionId;
            lastUserId = attempt.userId;
        }
        return attemptGroups;
    }

    render()
    {
        if (this.state.attempts == null && !this.state.hasLoaded)
            this.getActivitysAsync();

        return (
            <div align="center">
                {
                    this.state.attempts != null
                        ?
                        (
                            <table>
                                <tbody>
                                    {this.getAttemptGroups().map(g =>
                                        <tr key={g.sessionId.toString() + "." + g.userId.toString()}>
                                            <td>
                                                <table className="grid" width="100%">
                                                    <tbody>
                                                        <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                                            <td colSpan="100">{formatDate(g.attempts[0].sessionDate)}, {g.attempts[0].locationName}</td>
                                                        </tr>
                                                        <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                                                            <td colSpan="100">
                                                                Climber:&nbsp;
                                                                {this.state.userId === g.userId ? <Link to={`/sessions/${g.sessionId}`}>{g.attempts[0].userFirstName} {g.attempts[0].userLastName}</Link> : g.attempts[0].userFirstName} {g.attempts[0].userLastName}
                                                            </td>
                                                        </tr>
               
                                                            <tr>
                                                                    <th colSpan="2">Route</th>
                                                                    <th align="left">Type</th>
                                                                    <th align="left">Rating</th>
                                                                    <th align="left">Location</th>
                                                                    <th><img src={require('./assets/result-finish.png')} alt="" /></th>
                                                                </tr>
                                                                {g.attempts.map(a =>
                                                                    <tr key={a.id}>
                                                                        <td width="16" style={{ backgroundColor: a.routeColor }}></td>
                                                                        <td width="300" nowrap="true">{a.routeName}</td>
                                                                        <td width="100" nowrap="true">{a.routeType}</td>
                                                                        <td width="60" nowrap="true">{a.routeRating}</td>
                                                                        <td width="200" >{a.routeSublocation}</td>
                                                                        {
                                                                            a.result === 0 && a.percentage !== 0
                                                                                ?
                                                                                <td width="40" nowrap="true" style={{ color: 'red' }}>{a.percentage || 0}%</td>
                                                                                :
                                                                                <td width="40" nowrap="true" align="center">{getResultPic(a.result) != null ? <img src={require('./assets/' + getResultPic(a.result))} alt="" /> : ""}</td>
                                                                        }
                                                                    </tr>)}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>)}
                                </tbody>
                            </table>
                                    )
                                :
                                    <WaitLoading hasLoaded={this.state.hasLoaded} />
                                    }
                <p><a href={this.state.urlApiRead}>API</a></p>
            </div >
                                );
                            }
                        }
                        
export default ActivityList;