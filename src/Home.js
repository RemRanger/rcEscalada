import React from 'react';
import ActivityList from "./ActivityList";

function Home(props)
{
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Latest activity</h1>
            <ActivityList userId={props.userId} />
        </div >
    );
}

export default Home;