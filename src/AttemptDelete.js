import React, { Component } from 'react';
import { getApiUrl } from "./Utils";
import DatePicker from "./DatePicker";
import { Redirect } from "react-router-dom";

class AttemptDelete extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
            {
                attempt: null,
                urlApiRead: `${getApiUrl("attempt", "read")}?id=${this.props.match.params.id}&userId=${this.props.match.params.userId}`,
                urlApiDelete: `${getApiUrl("attempt", "delete")}?id=${this.props.match.params.id}`,
                redirectPath: null
            }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getAttemptAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let attempts = await response.json();
        console.log("Getting attempt data:", attempts);

        let attempt = attempts[0];
        this.setState({ attempt: attempt, hasLoadedAttempt: true });

        return attempt;
    }

    isValid()
    {
        return this.state.attempt != null;
    }

    handleSubmit(event)
    {
        event.preventDefault();

        this.submitAttemptAsync();
    }

    submitAttemptAsync = async () =>
    {
        let formData = new FormData();
        formData.append('id', this.state.attempt.id);

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
        this.setState({ redirectPath: `/sessions/${this.props.match.params.sessionId}/${this.props.match.params.userId}` });
    }

    render()
    {
        if (this.state.attempt == null && !this.state.hasLoadedAttempt)
            this.getAttemptAsync();

        if (!this.state.redirectPath)
        {
            return (
                <div align="center">
                    <h1>Delete attempt</h1>
                    {this.state.attempt != null
                        ?
                        (<div align="center">
                            <form method="post" onSubmit={this.handleSubmit}>
                                <p>Are you sure you want to delete your attempt on route '{this.state.attempt.routeName}'?</p>
                                <button style={{ width: '100px' }} type="submit" disabled={!this.isValid}>Yes</button>&nbsp;&nbsp;
                                    <input type="button" value="No" style={{ width: '100px' }} onClick={this.goBack} />
                            </form>
                        </div >
                        )
                        :
                        ('Loading... please wait')
                    }
                </div >)
        }
        else
            return <Redirect to={this.state.redirectPath} />;
    }
}

export default AttemptDelete;