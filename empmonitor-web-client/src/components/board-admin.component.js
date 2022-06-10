import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props)

    this.onDelete = this.onDelete.bind(this);
    this.loadCitizenList = this.loadCitizenList.bind(this);
    this.loadContactDetails = this.loadContactDetails.bind(this);
    this.state = {
      content: "",
      userList: [],
      contactDetails: {}
    };
  }

  componentDidMount() {
    UserService.getAdminBoard().then(
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

  onDelete(nid) {
    UserService.deleteCitizen(nid).then(
      response => {
        this.loadCitizenList();
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

  loadContactDetails(nid) {
    UserService.getContactDetails(nid).then(
      response => {
        this.setState({
          contactDetails: response.data
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

  render() {
    return (
      <>
        <div className="container">
          <header className="jumbotron">
            <h1>Citizen List</h1>
          </header>
            <div>
              <ul class="list-group">
                  {this.state.userList && this.state.userList.map(item => (
                  <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                      <div>{item.id}</div>
                      <div>{item.name}</div>
                      <div>{item.username}</div>
                      <button onClick={e => this.loadContactDetails(item.nid)} class="btn btn-primary btn-sm" data-toggle="modal" data-target="#contactDetail">Contact Details</button>
                      <button onClick={e => this.onDelete(item.nid)}class="btn btn-sm"><i class="fa fa-trash"></i></button>
                  </li>
                  ))}
              </ul>
            </div>
            
            <div class="modal fade" id="contactDetail" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Contact Details</h5>
                  </div>
                  <div class="modal-body">
                    {this.state.contactDetails.email ? <p><b>E-mail:</b> {this.state.contactDetails.email}</p>:<p>No contact details available.</p>}
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </>
    );
  }
}
