import React, { Component } from "react";
import Process from "./Process";
import "./ProcessList.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

class ProcessList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [],
      errors: [],
      errorsOpen: false
    };
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addTask = this.addTask.bind(this);
    this.addTaskFIFO = this.addTaskFIFO.bind(this);
    this.addTaskPriority = this.addTaskPriority.bind(this);
    this.killProcess = this.killProcess.bind(this);
    this.killProcessPriority = this.killProcessPriority.bind(this);
    this.killAllProcesses = this.killAllProcesses.bind(this);
  }

  componentDidMount() {
    this._asyncRequest = this.loadTasks();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  getRandomPriority() {
    let predefined_prorities = ['LOW', 'MEDIUM', 'HIGH'];
    let random = Math.floor(Math.random() * predefined_prorities.length);
    return predefined_prorities[random];
  }

  loadTasks() {
    axios.get("/tasks").then(
      response => {
        this._asyncRequest = null;
        let data = response.data;
        this.setState({ processes: data });
      });
  }

  addTask() {
    let value = this.getRandomPriority();
    axios.post("/tasks/process", { priority: value })
      .then((response) => {
        this.loadTasks();
      })
      .catch((error) => {
        if (error.response) {
          let errors = [...this.state.errors];
          if (errors.indexOf(error.response.data.error) === -1) {
            errors.push(error.response.data.error);
            this.setState({ errors });
          }
        }
      })
  }

  addTaskFIFO() {
    let value = this.getRandomPriority();
    axios.post("/tasks/process-fifo", { priority: value })
      .then((response) => {
        this.loadTasks();
      })
      .catch((error) => {
        if (error.response) {
          let errors = [...this.state.errors];
          if (errors.indexOf(error.response.data.error) === -1) {
            errors.push(error.response.data.error);
            this.setState({ errors });
          }
        }
      })
  }

  addTaskPriority() {
    let value = this.getRandomPriority();
    axios.post("/tasks/process-priority", { priority: value })
      .then((response) => {
        this.loadTasks();
      })
      .catch((error) => {
        if (error.response) {
          let errors = [...this.state.errors];
          if (errors.indexOf(error.response.data.error) === -1) {
            errors.push(error.response.data.error);
            this.setState({ errors });
          }
        }
      })
  }

  killProcess(uuid) {
    axios.delete(`/tasks/process/${uuid}`)
      .then((response) => {
        this.loadTasks();
      })
      .catch((error) => {
        if (error.response) {
          let errors = [...this.state.errors];
          if (errors.indexOf(error.response.data.error) === -1) {
            errors.push(error.response.data.error);
            this.setState({ errors });
          }
        }
      })
  }

  killProcessPriority() {
    let value = this.getRandomPriority();
    axios.delete(`/tasks/processes-priority/${value}`)
      .then((response) => {
        this.loadTasks();
      })
      .catch((error) => {
        if (error.response) {
          let errors = [...this.state.errors];
          if (errors.indexOf(error.response.data.error) === -1) {
            errors.push(error.response.data.error);
            this.setState({ errors });
          }
        }
      })
  }

  killAllProcesses() {
    axios.delete(`/tasks/processes-all`)
      .then((response) => {
        this.loadTasks();
      })
  }

  remove(id) {
    this.setState({
      processes: this.state.processes.filter(t => t.id !== id)
    });
  }

  handleChange(event) {
    // setAge(event.target.value);
  };

  formatDateTime(input) {
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input));
    var date = epoch.toISOString();
    date = date.replace('T', ' ');
    return date.split('.')[0].split(' ')[0] + ' ' + epoch.toLocaleTimeString().split(' ')[0];
  };

  render() {
    let Errors;
    let result;
    let killButtons;
    let Processes;
    if (this.state.errors.length > 0) {
      Errors = this.state.errors.map(error => {
        return (
          <div className="error-content">
            <Collapse in={this.state.errors.indexOf(error) !== -1}>
              <Alert severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      let errors = [...this.state.errors].filter(curError => curError !== error)
                      this.setState({ errors });
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            </Collapse>
          </div>
        );
      })
    }
    if (this.state.processes.length > 0) {
      Processes = this.state.processes.map(process => {
        return (
          <CSSTransition key={process.id} timeout={500} classNames='Process'>
            <Process
              key={process.id}
              id={process.id}
              creationTime={this.formatDateTime(process.creationTime)}
              priority={process.priority}
              removeProcess={this.killProcess}
            />
          </CSSTransition>
        );
      });
      killButtons = (
        <div>
          <div className='Process-buttons'>
            <button onClick={this.killProcessPriority}>
              <i className="fa fa-minus-square" aria-hidden="true"></i> Kill processes with random priority
          </button>
          </div>
          <div className='Process-buttons'>
            <button onClick={this.killAllProcesses}>
              <i className="fa fa-minus-square" aria-hidden="true"></i> Kill all processes
          </button>
          </div>
        </div>
      );
    } else {
      result = (<div className="content-center"><span>no processes</span></div>)
    }
    return (
      <div className='ProcessList'>
        <h1>
          Task Manager <span>List of the current processes.</span>
        </h1>
        {Errors}
        <div className='Process-buttons'>
          <button onClick={this.addTask}>
            <i className="fa fa-plus-square" aria-hidden="true"></i> Add process
          </button>
        </div>
        <div className='Process-buttons'>
          <button onClick={this.addTaskFIFO}>
            <i className="fa fa-plus-square" aria-hidden="true"></i> Add process FIFO
          </button>
        </div>
        <div className='Process-buttons'>
          <button onClick={this.addTaskPriority}>
            <i className="fa fa-plus-square" aria-hidden="true"></i> Add process with random priority
          </button>
        </div>
        <ul>
          <TransitionGroup className='Process-list'>{Processes}</TransitionGroup>
        </ul>
        {result}
        {killButtons}
      </div>
    );
  }
}
export default ProcessList;
