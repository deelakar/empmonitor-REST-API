import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/auth.service";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);
    this.onChangeQualification = this.onChangeQualification.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.state = {
      content: "",
      qualifications: "",
      file: "",
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser})
    UserService.getUserBoard().then(
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
  }

  onChangeQualification(e) {
    console.log( e.target.value)
    this.setState({
      qualifications:  e.target.value
    })
  }

  onChangeFile(e) {
    console.log(e.target.files[0])
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    UserService.uploadFile(formData).then(
      response => {
        this.setState({
          file: response.data.filename
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
      })
  }

  onUpdate(e) {
    e.preventDefault();
    console.log(this.state.currentUser)
    UserService.updateQualification(this.state.currentUser.nid,this.state.qualifications,this.state.file).then(
      response => {
        alert("Successfully updated...")
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
      })
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h1>Complete Your Details</h1>
        </header>

        <Form
            onSubmit={this.onUpdate}
            ref={c => {
              this.form = c;
            }}
          >
              <div>
                <div className="form-group">
                  <label htmlFor="email">Qualification</label>
                  <Input
                    type="text"
                    name ="qualification"
                    className="form-control"
                    onChange={e => this.onChangeQualification(e)}
                  />
                </div>
                <div className="form-group">
                  <Input
                    type="file"
                    className="form-control"
                    onChange={this.onChangeFile}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Update Qualification</button>
                </div>
              </div>
        </Form>
      </div>
    );
  }
}
