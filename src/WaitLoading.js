import React, { Component } from 'react';

class WaitLoading extends Component
{
    render()
    {
        return <p>{this.props.hasLoaded ? "No results." : "Loading... please wait"}</p>
    }
}

export default WaitLoading