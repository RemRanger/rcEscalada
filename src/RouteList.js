import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { getResultPic } from "./Utils";
import { getApiUrl } from "./Utils";

class RouteList extends Component
{
	state = { routes: null, urlApiRead: `${getApiUrl('route', "read")}?locationId=${this.props.locationId}` }

	getRoutesAsync = async () =>
	{
		let response = await fetch(this.state.urlApiRead);
		let data = await response.json();
        console.log("Getting routes data:", data);

		this.setState({ routes: data });

		return data;
	}

	render()
	{
		if (this.state.routes == null)
			this.getRoutesAsync();

		return (
			<div align="center">
		    {
			    this.state.routes
			    ?
			    (
				    <table className="grid">
					    <thead>
						    <tr>
							    <th colSpan="2">Route</th>
                                <th>Rating</th>
                                <th align="left">Location</th>
                                <th><img src={require('./assets/result-finish.png')} /></th>
						    </tr>
					    </thead>
					    <tbody>
						    {this.state.routes.filter(r => r.dateUntil == null).map(r =>
							    <tr key={r.id}>
                                    <td width="16" style={{backgroundColor: r.color}}></td>
								    <td>{r.name}</td>
                                    <td>{r.routeUntil}</td>
                                    <td>{r.sublocation}</td>
                                    {
                                        r.result == 0 && r.percentage != 0
                                        ?
                                          <td style={{color: 'red'}}>{r.percentage || 0}%</td>
                                        :
                                          <td align="center">{getResultPic(r.result) != null ? <img src={require('./assets/' + getResultPic(r.result))} /> : ""}</td>
                                    }
	    					    </tr>)}
					    </tbody>
				    </table>
				    )
				    :
				    ('Loading... please wait')
			}
            <p><a href={this.state.urlApiRead}>API</a></p>
			</div >
		);
	}
}

export default RouteList;