import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Header from './Header';

class EmployeeOverview extends Component {
    state = {
        employeeName: '',
        subOrdinates: [],
        error: { message: '' }
    }

    componentDidMount() {
        let empName = this.props.match.params.name;
        if (empName) {
            this.setState({
                employeeName: empName
            });
            this.findAllReportees(empName);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.name !== this.state.employeeName) {
            this.setState({
                subOrdinates: []
            }, () => {
                this.setState({ employeeName: nextProps.match.params.name });
                this.findAllReportees(nextProps.match.params.name)
            });

        }
    }


    findAllReportees = (name) => {
        fetch(`http://api.additivasia.io/api/v1/assignment/employees/${name}`)
            .then(response => response.json())
            .then(data => {
                if (data[1]) {
                    console.log("Direct reportee for " + name, data[1]);
                    let directReportee = data[1]['direct-subordinates'];
                    directReportee.forEach(el => {
                        let alreadyExist = this.state.subOrdinates.find(sub => sub.name === el);
                        let type;
                        if (!alreadyExist) {
                            if (name === this.props.match.params.name) {
                                type = 'direct';
                            } else {
                                type = 'indirect';
                            }
                            let tempSub = this.state.subOrdinates;
                            tempSub.push({
                                type,
                                name: el
                            });
                            this.setState({
                                subOrdinates: tempSub
                            })
                        }
                        this.findAllReportees(el)
                    });
                } else {
                    return;
                }
            }).catch(err => {
                console.log("Error occured while fetching data", err);
                this.setState({
                    error: err
                });
            });
    }


    render() {
        return (
            <div className="mt-5">
                <Header title="Employee Overview" />
                {
                    this.state.subOrdinates.length > 0 ? (
                        <div>
                            <div>Subordinates of employee {this.props.match.params.name}</div>
                            <ul className="list-group">
                                {
                                    this.state.subOrdinates.map(person =>
                                        <li className="list-group-item list-group-item-action list-group-item-light text-center" key={person.name}><Link to={`/overview/${person.name}`}>{person.name}{
                                            person.type === 'direct' ?  <span class="badge badge-primary ml-2">{person.type}</span> : <span class="badge badge-secondary ml-2">{person.type}</span> 
                                        }</Link></li>
                                    )
                                }
                            </ul>
                        </div>
                    ) : (<div>No data found for {this.state.employeeName}</div>)
                }
            </div>
        );
    }
}

export default EmployeeOverview;