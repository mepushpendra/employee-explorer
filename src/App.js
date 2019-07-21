import React, { Component } from 'react';
import './App.css';
import Header from './Header';

class App extends Component {

  state = {
    employeeName: '',
    history: [],
  }

  handleChange = (event) => {
    if((event.target.value).trim() !== '') {
      this.setState({ employeeName: event.target.value });
    }
  }

  componentDidMount() {
    this.recover();
  }

  recover() {
    //parse the localstorage value
    let data = localStorage.getItem('history');
    if (data) {
      this.setState({ history: JSON.parse(data) });
    }
  }


  searchEmployee = () => {
    if (this.state.employeeName) {
      const inHistory = this.state.history.find(element => element.toUpperCase() === (this.state.employeeName).toUpperCase());
      if (!inHistory) {
        this.setState({
          history: [...this.state.history, this.state.employeeName]
        }, () => {
          localStorage.setItem('history', JSON.stringify(this.state.history));
          this.props.history.push(`/overview/${this.state.employeeName}`);
        });
      } else {
        this.props.history.push(`/overview/${this.state.employeeName}`);
      }
    } else {
      alert("Please enter employee name");
    }
  }

  render() {
    return (
      <div className="container">
        <Header title="Employee Explorer" />
        <div className="row">
          <div className="col-sm-8">
            <input
              className="form-control form-control-lg form-control-borderless"
              type="search"
              placeholder="Search Employee"
              onChange={this.handleChange}
            />
          </div>
          <div className="col-sm-4">
            <button
              className="btn btn-lg btn-success"
              onClick={this.searchEmployee}
              type="submit">Search</button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm-2">
            History of Search:
          </div>
          <div className="col-sm-6 p-10">
            <ul>
              {
                this.state.history.length > 0 && (this.state.history).map(element => <li className="list-group-item list-group-item-dark text-center" key={element}>{element}</li>)
              }
            </ul>

          </div>
        </div>
      </div>
    );
  }
}

export default App;