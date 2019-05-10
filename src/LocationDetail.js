import React, { Component } from 'react';
import RouteList from "./RouteList";
import WaitLoading from "./WaitLoading";

class LocationDetail extends Component
{
    state = { location: null }

    getLocationAsync = async () =>
    {
        let response = await fetch(`https://www.remranger.com/escalada-api/location-read.php?id=${this.props.match.params.id}`);
        let data = await response.json();
        console.log("Getting locations data:", data);

        this.setState({ location: data[0] });

        return data;
    }

    render()
    {
        if (this.state.location == null)
            this.getLocationAsync();

        return (
            <div align="center">
                <h1>Topo</h1>
                {
                    this.state.location
                        ?
                        (
                            <div>
                                <p>{this.state.location.name}</p>
                                <RouteList locationId={this.props.match.params.id} />
                            </div>
                        )
                        :
                        <WaitLoading />
                }
            </div >
        );
    }
}

export default LocationDetail;