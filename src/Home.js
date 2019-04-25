import React from 'react';
import ActivityList from "./ActivityList";

function About()
{
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Latest activity</h1>
            <ActivityList />
        </div >
    );
}

export default About;