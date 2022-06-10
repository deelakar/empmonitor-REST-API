import React, { Component } from "react";

import UserService from "../services/user.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import EventBus from "../common/EventBus";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onSearchTerm = this.onSearchTerm.bind(this); 
    this.onSearch = this.onSearch.bind(this); 
    this.findCitizenList = this.findCitizenList.bind(this); 
    this.loadUserDetails = this.loadUserDetails.bind(this); 

    this.state = {
      content: "",
      searchTerm: "",
      userSel:{},
      userList:[],
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  findCitizenList() {
    UserService.findCitizenList(this.state.searchTerm).then(
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

  

  onSearchTerm(e) {
    this.setState({
      searchTerm:  e.target.value
    })
  }

  onSearch(e) {
    e.preventDefault();
    this.findCitizenList();
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Search</h3>
        </header>
        <Form
            onSubmit={this.onSearch}
            ref={c => {
              this.form = c;
            }}
          >
              <div>
                <div className="form-group">
                  <label htmlFor="email">Terms</label>
                  <Input
                    type="text"
                    className="form-control"
                    onChange={this.onSearchTerm}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Find</button>
                </div>
              </div>
          </Form>

          <div>
            <ul class="list-group">
                {this.state.userList && this.state.userList.map(item => (
                <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                    <div>{item.id}</div>
                    <div>{item.name}</div>
                    <div>{item.username}</div>
                    <button onClick={e => this.loadUserDetails(item.nid)} class="btn btn-primary btn-sm" data-toggle="modal" data-target="#viewDetails">View</button>
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
                  { console.log( UserService.getResourceURL() + this.state.userSel.file)}
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
