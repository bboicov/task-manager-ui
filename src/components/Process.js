import React, { Component } from "react";
import "./Process.css";
import Grid from '@material-ui/core/Grid';

class Process extends Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleRemove() {
    this.props.removeProcess(this.props.id);
  }
  render() {
    let result;
    result = (
        <li className='Process-item'>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {this.props.id}
            </Grid>
            <Grid item xs={2}>
              {this.props.priority}
            </Grid>
            <Grid item xs={4}>
              {this.props.creationTime}
            </Grid>
          </Grid>
        </li>
    );
    return (
      <div className='Process'>
        {result}
        <div className='Process-buttons'>
          <button onClick={this.handleRemove}>
            <i className='fas fa-trash' />
          </button>
        </div>
      </div>
    );
  }
}
export default Process;
