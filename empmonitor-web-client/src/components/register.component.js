import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 10 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
       NID should contain 11 characters. Format 200293333V or newer format.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onChangeProfession = this.onChangeProfession.bind(this);
    this.onChangeAffiliation = this.onChangeAffiliation.bind(this);


    // this.state = {
    //   username: "",
    //   email: "",
    //   password: "",
    //   successful: false,
    //   message: "",
    //   name: "",
    //   age: "",
    //   latitude: "",
    //   longitude: "",
    //   profession: "",
    //   affiliation: "",
    // };

    this.state = {
      username: "udayangaac",
      email: "",
      password: "",
      successful: false,
      message: "",
      name: "Chamith",
      age: "12",
      latitude: "9.0001",
      longitude: "9.0001",
      profession: "Eng",
      affiliation: "Test",
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeName(e) {
    console.log(e.target.value)
    this.setState({
      name: e.target.value
    })
  }

  onChangeAge(e) {
    this.setState({
      age: e.target.value
    });
  }

  onChangeLatitude(e) {
    this.setState({
      latitude: e.target.value
    });
  }

  onChangeLongitude(e) {
    this.setState({
      longitude: e.target.value
    });
  }

  onChangeProfession(e) {
    this.setState({
      profession: e.target.value
    });
  }

  onChangeAffiliation(e) {
    this.setState({
      affiliation: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.name,
        this.state.age,
        this.state.latitude,
        this.state.longitude,
        this.state.profession,
        this.state.affiliation
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">NID</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>

                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChangeName}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>


                {/* AGE */}
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <Input
                    type="number"
                    className="form-control"
                    name="age"
                    value={this.state.age}
                    onChange={this.onChangeAge}
                    validations={[required]}
                  />
                </div>


                {/* Lat */}
                <div className="form-group">
                  <label htmlFor="latitude">Latitude</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="latitude"
                    value={this.state.latitude}
                    onChange={this.onChangeLatitude}
                    validations={[required]}
                  />
                </div>

                {/* Lon */}
                <div className="form-group">
                  <label htmlFor="longitude">Longitude</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="longitude"
                    value={this.state.longitude}
                    onChange={this.onChangeLongitude}
                    validations={[required]}
                  />
                </div>

                 {/* Profession */}
                 <div className="form-group">
                  <label htmlFor="profession">Profession</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="profession"
                    value={this.state.profession}
                    onChange={this.onChangeProfession}
                    validations={[required]}
                  />
                </div>

                 {/* Affiliation */}
                 <div className="form-group">
                  <label htmlFor="affiliation">Affiliation</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="affiliation"
                    value={this.state.affiliation}
                    onChange={this.onChangeAffiliation}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
