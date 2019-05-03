import React, { Component } from 'react';
import { getApiUrl } from "./Utils";
import DatePicker from "./DatePicker";

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
                urlApiReadUsers: getApiUrl("user", "read")
            }

        this.handleDateChange = this.handleDateChange.bind(this);
 }

    getSessionAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let sessions = await response.json();
        console.log("Getting session data:", sessions);

        let session = sessions[0];
        session.partnerIds = session.partnerIdsAsString.toString().split(",").map(i => i.trim());

        this.setState({ session: session, hasLoadedSession: true });

        return session;
    }

    getLocationsAsync = async () =>
    {
        let response = await fetch(this.state.urlApiReadLocations);
        let data = await response.json();
        console.log("Getting locations data:", data);

        this.setState({ locations: data });

        return data;
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
            this.state.session.date = newDate;

        console.log("Date set: ", newDate);
    }

    render()
    {
        if (this.state.session == null && !this.state.hasLoadedSession)
            this.getSessionAsync();
        if (this.state.locations == null)
            this.getLocationsAsync();
        if (this.state.users == null)
            this.getUsersAsync();

        return (
            <div align="center">
                <h1>Edit session</h1>
                {this.state.locations != null && this.state.users != null
                    ?
                    (<form method="post" novalidate onSubmit="submit()">
                        <table>
                            <tr>
                                <td align="center">
                                    <DatePicker date={this.state.session ? this.state.session.date : new Date()} onChange={this.handleDateChange} />
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <select name="locationId" required>
                                        <option disabled selected value="undefined">--Please select a location--</option>
                                        {this.state.locations.map(l =>
                                            <option value={l.id} selected={this.state.session != null && this.state.session.locationId == l.id} >{l.name}</option>)
                                        }
                                    </select >
                                </td >
                            </tr >
                            {/*<tr ><td align="center" style={{ color: 'red', fontSizeAdjust: 0.4 }}>Please select a location.</td></tr >*/}
                            <tr>
                                <td align="center">
                                    <select name="partnerIds[]" multiple size='30'>
                                        <option disabled>--Were you with others? If so, please select--</option>
                                        {this.state.users.map(u =>
                                            <option value={u.id} selected={this.state.session != null && this.state.session.partnerIds.includes(u.id.toString())}>{u.firstName} {u.lastName}</option>)
                                        }
                                    </select>
                                </td >
                            </tr >
                            <tr>
                                <td>
                                    <textarea rows="4" cols="50" name="comment" form="sessionform">{this.state.session ? this.state.session.comment : ""}</textarea>
                                </td>
                            </tr >
                        </table >
                        <br />
                        <button style={{ width: '100px' }} type="submit" disabled="!sessionEditForm.valid" > OK</button >&nbsp;&nbsp;
                    <input type="button" value="Cancel" style={{ width: '100px' }} onClick="history.go(-1);" />
                    </form >)
                    :
                    ('Loading... please wait')
                }
            </div >)
    }
}

export default SessionEdit;