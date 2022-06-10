import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

export default class BoardModerator extends Component {
  constructor(props) {
    super(props);
    this.loadCitizenList = this.loadCitizenList.bind(this);
    this.loadUserDetails = this.loadUserDetails.bind(this);
    this.checkBox = this.checkBox.bind(this);
    
    this.state = {
      content: "",
      userList:[],
      userSel:{},
    };
  }
  
  componentDidMount() {
    UserService.getCitizenList().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
    this.loadCitizenList();
  }

  loadCitizenList() {
    UserService.getCitizenList().then(
      response => {
        this.setState({
          userList: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  loadUserDetails(nid) {
    UserService.getUserDetails(nid).then(
      response => {
        this.setState({
          userSel: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  checkBox(e,nid) {
    UserService.updateApproval(nid,e.target.checked).then(
      response => {
        alert(response.data.message)
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h1>Citizens</h1>
        </header>
          <div>
            <ul class="list-group">
                {this.state.userList && this.state.userList.map(item => (
                <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                    <div>{item.id}</div>
                    <div>{item.name}</div>
                    <div>{item.username}</div>
                    <button onClick={e => this.loadUserDetails(item.nid)} class="btn btn-primary btn-sm" data-toggle="modal" data-target="#viewDetails">View</button>
                    <input type="checkbox" onChange={e => this.checkBox(e,item.nid)} defaultChecked={item.approved}/>
                </li>
                ))}
            </ul>
          </div>
          <div class="modal fade" id="viewDetails" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Citizen Details</h5>
                </div>
                <div class="modal-body">
                  <p><strong>NID: </strong>{this.state.userSel.nid}</p>
                  <p><strong>Name: </strong>{this.state.userSel.name}</p>
                  <p><strong>Age: </strong>{this.state.userSel.age}</p>
                  <p><strong>Longitude: </strong>{this.state.userSel.longitude}</p>
                  <p><strong>Latitude: </strong>{this.state.userSel.latitude}</p>
                  <p><strong>Profession: </strong>{this.state.userSel.profession}</p>
                  <p><strong>Affiliation: </strong>{this.state.userSel.affiliation}</p>
                  <p><strong>Qualification: </strong>{this.state.userSel.qualification}</p>
                  { console.log( UserService.getResourceURL() + this.state.userSel.docs)}
                  {this.state.userSel ? <p><strong>Related Docs: </strong><a href={UserService.getResourceURL() + this.state.userSel.file}>Download</a></p> : <></>}

                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div> 
          </div>
      </div>
    );
  }
}
