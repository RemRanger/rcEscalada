import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { getApiUrl } from "./Utils";
import WaitLoading from "./WaitLoading";

class LocationList extends Component
{
    state = { locations: null, urlApiRead: getApiUrl('location', "read") }

    getLocationsAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let data = await response.json();
        console.log("Getting locations data:", data);

        this.setState({ locations: data });

        return data;
    }

    render()
    {
        if (this.state.locations == null)
            this.getLocationsAsync();

        console.log("Rendering, this.state.locations:", this.state.locations);
        return (
            <div align="center">
                <h1>Locations</h1>
                {
                    this.state.locations
                        ?
                        (
                            <table className="grid">
                                <thead>
                                    <tr>
                                        <th colSpan="2">Location</th>
                                        <th>Website</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.locations.map(l =>
                                        <tr key={l.id}>
                                            <td>{l.name}</td>
                                            <td><Link to={`locations/${l.id}`}>&nbsp;Topo&nbsp;</Link></td>
                                            <td><a href={`http://${l.websiteUrl}`}>{l.websiteUrl}</a></td>
                                        </tr>)}
                                </tbody>
                            </table>
                        )
                        :
                        <WaitLoading />
                }
                <p><a href={this.state.urlApiRead}>API</a></p>
            </div >
        );
    }
}

export default LocationList;