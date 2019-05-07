import React, { Component } from 'react';
import { getApiUrl } from "./Utils";
import DatePicker from "./DatePicker";
import { Redirect } from "react-router-dom";

class SessionEdit extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
            {
                session: null,
                locations: null,
                users: null,
                hasLoadedSession: false,
                urlApiRead: `${getApiUrl("session", "read")}?id=${this.props.match.params.id}&userId=${this.props.match.params.userId}`,
                urlApiReadLocations: getApiUrl("location", "read"),
                urlApiReadUsers: getApiUrl("user", "read"),
                urlApiCreate: getApiUrl("session", "create"),
                urlApiUpdate: getApiUrl("session", "update"),
                submitted: false
            }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePartnersChange = this.handlePartnersChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSessionAsync = async () =>
    {
        let session = null;
        if (this.props.match.params.id == 0)
            session =
                {
                    id: 0,
                    date: new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString(),
                    partnerIds: [],
                    comment: ""
                };
        else
        {
            let response = await fetch(this.state.urlApiRead);
            let sessions = await response.json();
            console.log("Getting session data:", sessions);

            session = sessions[0];
            session.partnerIds = session.partnerIdsAsString != null ? session.partnerIdsAsString.toString().split(",").map(i => i.trim()) : "";
        }

        this.setState({ session: session, hasLoadedSession: true });

        return session;
    }

    getLocationsAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadLocations);
        let locations = await response.json();
        console.log("Getting locations data:", locations);

        this.setState({ locations: locations });

        if (this.state.session.id == 0 && locations != null && locations.length > 0)
        {
            let session = this.state.session;
            session.locationId = locations[0].id;
            this.setState({ session: session });
        }

        return locations;
    }

    getUsersAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadUsers);
        let data = await response.json();
        console.log("Getting users data:", data);

        this.setState({ users: data });

        return data;
    }

    handleDateChange(newDate)
    {
        if (this.state.session != null)
        {
            let session = this.state.session;
            session.date = newDate;
            this.setState({ session: session });
            console.log("Session: ", session);
        }

        console.log("Date set: ", newDate);
    }

    handleChange(event)
    {
        let name = event.target.name;
        let value = event.target.value;

        let session = this.state.session;
        if (session !== null)
        {
            if (name === 'locationId')
                session.locationId = value;
            else if (name === 'comment')
                session.comment = value;
            else if (name === 'partnerIds')
            {
                console.log("PartnerIds: ", value);
                session.partnerIds = value;
            }
            this.setState({ session: session });
        }

        console.log("Session: ", session);
    }

    handlePartnersChange(event)
    {
        if (this.state.session)
        {
            var options = event.target.options;
            var value = [];
            for (var i = 0, l = options.length; i < l; i++)
            {
                if (options[i].selected)
                {
                    value.push(options[i].value);
                }
            }
            let session = this.state.session;
            session.partnerIds = value;
            this.setState({ session: session });

            console.log("partnerIds: ", value);

            //this.props.someCallback(value);
        }
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
        if (this.state.session.id > 0)
            formData.append('id', this.state.session.id);
        formData.append('locationId', this.state.session.locationId);
        formData.append('date', this.state.session.date);
        formData.append('comment', this.state.session.comment);
        formData.append('userId', this.props.match.params.userId);
        for (let i = 0; i < this.state.session.partnerIds.length; i++)
            formData.append('partnerIds[' + i + ']', this.state.session.partnerIds[i]);


        let response = null;
        if (this.state.session.id == 0)
        {
            console.log("urlApiCreate: ", this.state.urlApiCreate);
            console.log('locationId', this.state.session.locationId);
            console.log('date', this.state.session.date);
            console.log('comment', this.state.session.comment);
            console.log('userId', this.props.match.params.userId);
            response = await fetch(this.state.urlApiCreate,
                {
                    method: 'post',
                    body: formData
                });
        }
        else
        {
            response = await fetch(this.state.urlApiUpdate,
                {
                    method: 'post',
                    body: formData
                });
        }
        let data = null;
        try
        {
            console.log("Submit");
            data = await response.json();
            console.log("Getting response:", data);
            this.setState({ submitted: true });
        }
        finally
        {
        }
        return data;
    }

    render()
    {
        if (this.state.session == null && !this.state.hasLoadedSession)
            this.getSessionAsync();
        if (this.state.locations == null)
            this.getLocationsAsync();
        if (this.state.users == null)
            this.getUsersAsync();

        if (!this.state.submitted)
        {
            return (
                <div align="center">
                    <h1>Edit session</h1>
                    {this.state.locations != null && this.state.users != null
                        ?
                        (<form method="post" novalidate onSubmit={this.handleSubmit}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td align="center">
                                            <DatePicker date={this.state.session ? this.state.session.date : new Date()} onChange={this.handleDateChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <select name="locationId" required value={this.state.session ? this.state.session.locationId : 0} onChange={this.handleChange}>
                                                <option disabled>--Please select a location--</option>
                                                {this.state.locations.map(l =>
                                                    <option key={l.id} value={l.id}>{l.name}</option>)
                                                }
                                            </select >
                                        </td >
                                    </tr >
                                    {/*<tr ><td align="center" style={{ color: 'red', fontSizeAdjust: 0.4 }}>Please select a location.</td></tr >*/}
                                    <tr>
                                        <td align="center">
                                            <select name="partnerIds" multiple size='30' onChange={this.handlePartnersChange}>
                                                <option disabled>--Were you with others? If so, please select--</option>
                                                {this.state.users.map(u =>
                                                    <option key={u.id} value={u.id} selected={this.state.session != null && this.state.session.partnerIds.includes(u.id.toString())}>{u.firstName} {u.lastName}</option>)
                                                }
                                            </select>
                                        </td >
                                    </tr >
                                    <tr>
                                        <td>
                                            <textarea rows="4" cols="50" name="comment" form="sessionform" value={this.state.session ? this.state.session.comment : ""} onChange={this.handleChange} />
                                        </td>
                                    </tr >
                                </tbody>
                            </table >
                            <br />
                            <button style={{ width: '100px' }} type="submit" disabled={!this.isValid()} > OK</button >&nbsp;&nbsp;
                            <input type="button" value="Cancel" style={{ width: '100px' }} onClick={this.props.history.goBack} />
                        </form >)
                        :
                        ('Loading... please wait')
                    }
                </div >)
        }
        else
            return <Redirect to={`/sessions/${this.props.match.params.userId}`} />;
    }
}

export default SessionEdit;