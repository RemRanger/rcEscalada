import React, { Component } from 'react';
import { getApiUrl, getUserId } from "./Utils";
import WaitLoading from "./WaitLoading";
import { Redirect } from "react-router-dom";

class SessionDelete extends Component
{
    constructor(props)
    {
        super(props);

        let userId = getUserId();

        this.state =
            {
                session: null,
                urlApiRead: `${getApiUrl("session", "read")}?id=${this.props.match.params.id}&userId=${userId}`,
                urlApiDelete: `${getApiUrl("session", "delete")}?id=${this.props.match.params.id}`,
                redirectPath: userId ? null : "/home"
            }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSessionAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let sessions = await response.json();

        let session = sessions[0];
        this.setState({ session: session, hasLoadedSession: true });

        return session;
    }

    isValid()
    {
        return this.state.session != null;
    }

    handleSubmit(event)
    {
        event.preventDefault();

        this.submitSessionAsync();
    }

    submitSessionAsync = async () =>
    {
        let formData = new FormData();
        formData.append('id', this.state.session.id);

        let response = null;
        response = await fetch(this.state.urlApiDelete,
            {
                method: 'post',
                body: formData
            });
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
        this.setState({ redirectPath: "/sessions" });
    }

    render()
    {
        if (this.state.session == null && !this.state.hasLoadedSession)
            this.getSessionAsync();

        if (!this.state.redirectPath)
        {
            return (
                <div align="center">
                    <h1>Delete session</h1>
                    {this.state.session != null
                        ?
                        (<div align="center">
                            <form method="post" onSubmit={this.handleSubmit}>
                                <p>Are you sure you want to delete your session of {this.state.session.date} at {this.state.session.locationName}?</p>
                                <button style={{ width: '100px' }} type="submit" disabled={!this.isValid}>Yes</button>&nbsp;&nbsp;
                                    <input type="button" value="No" style={{ width: '100px' }} onClick={this.goBack} />
                            </form>
                        </div >
                        )
                        :
                        <WaitLoading />
                    }
                </div >)
        }
        else
            return <Redirect to={this.state.redirectPath} />;
    }
}

export default SessionDelete;