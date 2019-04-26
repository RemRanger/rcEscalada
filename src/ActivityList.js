import React, { Component } from 'react';
import { getResultPic } from "./Utils";
import { getApiUrl } from "./Utils";
import { BrowserRouter as Router, Link } from "react-router-dom";

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
	state = { attempts: null, hasLoaded: false, urlApiRead: getApiUrl('attempt', "read") }

	getActivitysAsync = async () =>
	{
		let response = await fetch(this.state.urlApiRead);
        let data = null;
		try
        {
		    data = await response.json();
            //console.log("Getting attempts data:", data);
        }
        finally
        {
            this.setState({ attempts: data, hasLoaded: true});
        }

		return data;
	}

    getAttemptGroups(): AttemptGroup[]
    {
        let attemptGroups: AttemptGroup[] = [];
        let lastSessionId: number = null
        let attemptGroup: AttemptGroup;
        for (let attempt of this.state.attempts.sort((a, b) => { return b.sessionId - a.sessionId }))
        {
            if (attemptGroup == null  || lastSessionId == null || attempt.sessionId !== lastSessionId)
            {
                attemptGroup = new AttemptGroup()
                attemptGroup.sessionId = attempt.sessionId;
                attemptGroup.userId = attempt.userId;
                attemptGroups.push(attemptGroup);
            }
            attemptGroup.attempts.push(attempt);

            lastSessionId = attempt.sessionId;
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
					    {this.getAttemptGroups().map(g =>
                             <tr>
                                <td>
                                  <table class="grid" width="100%">
                                        <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                        <td colspan="100">{new Date(g.attempts[0].sessionDate).toDateString()}, {g.attempts[0].locationName}</td>
                                    </tr>
                                        <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                                            <td colspan="100"><Link to={`/sessions/${g.sessionId}/${g.userId}`}>Climber:&nbsp;{g.attempts[0].userFirstName} {g.attempts[0].userLastName}</Link></td>
                                    </tr>

						            <tr>
                                        <th colspan="2">Route</th>
                                        <th align="left">Type</th>
                                        <th align="left">Rating</th>
                                        <th align="left">Location</th>
                                        <th><img src={require('./assets/result-finish.png')} alt=""/></th>
						            </tr>
						            {g.attempts.map(a =>
							            <tr key={a.id}>
                                            <td width="16" style={{backgroundColor: a.routeColor}}></td>
								            <td width="300" nowrap>{a.routeName}</td>
                                            <td width="100" nowrap>{a.routeType}</td>
                                            <td width="60" nowrap>{a.routeRating}</td>
                                            <td width="200" >{a.routeSublocation}</td>
                                            { 
                                                a.result === 0 &&a.percentage !== 0
                                                ?
                                                  <td width="40" nowrap style={{color: 'red'}}>{a.percentage || 0}%</td>
                                                :
                                                  <td width="40" nowrap align="center">{getResultPic(a.result) != null ? <img src={require('./assets/' + getResultPic(a.result))} alt=""/> : ""}</td>
                                            }
	    					            </tr>)}
				                    </table>
                                </td>
                            </tr>)}
                        </table>
				    )
				    :
				    this.state.hasLoaded ? ('No results.') : ('Loading... please wait')
			}
            <p><a href={this.state.urlApiRead}>API</a></p>
			</div >
		);
	}
}

export default ActivityList;