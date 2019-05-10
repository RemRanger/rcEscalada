import React, { Component } from 'react';
import WaitLoading from "./WaitLoading";
import { getApiUrl } from "./Utils";

class UserList extends Component
{
    state = { users: null, urlApiRead: getApiUrl('user', "read") }

    getUsersAsync = async () =>
    {
        let response = await fetch(this.state.urlApiRead);
        let data = await response.json();

        this.setState({ users: data });

        return data;
    }

    render()
    {
        if (this.state.users == null)
            this.getUsersAsync();

        return (
            <div align="center">
                <h1>Climbers</h1>
                {
                    this.state.users
                        ?
                        (
                            <table className="grid">
                                <thead>
                                    <tr>
                                        <th colSpan="2">Climber</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.users.map(u =>
                                        <tr key={u.id}>
                                          <td width="16" style={{backgroundColor: u.gender === 'F' ? 'violet' : 'blue'}}></td>
                                          <td>{u.firstName} {u.lastName}</td>
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

export default UserList;