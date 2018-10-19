import React from "react";
import {createTodo, deleteTodo, fetchTodos} from "../actions/todosAction"
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import List from "@material-ui/core/List/List";
import {connect} from "react-redux"
import Typography from "@material-ui/core/Typography/Typography";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import uuid from "uuid/v1"

class Todos extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      newTodo: "",
      checked: [0],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.createTodo({id: uuid(), task: this.state.newTodo});
    this.setState({newTodo: ''})
  }

  handleToggle = value => () => {
    const {checked} = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    return (
      <div>
        <Typography variant="h3" color="inherit">
          Todos
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id="createTodo"
            fullWidth margin="normal" variant="outlined"
            label="New todo"
            placeholder="Add a new task"
            InputLabelProps={{shrink: true}}
            value={this.state.newTodo}
            onChange={({target}) => this.setState({newTodo: target.value})}
          />
        </form>
        <List>
          {this.props.todos.map(todo => (
            <ListItem key={todo.id} dense button onClick={this.handleToggle(todo)}>
              <Checkbox checked={this.state.checked.indexOf(todo) !== -1} tabIndex={-1} disableRipple/>
              <ListItemText primary={todo.task}/>
              <ListItemSecondaryAction>
                <Tooltip title="Delete">
                  <IconButton aria-label="Delete todo" onClick={() => this.props.deleteTodo(todo)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button variant="outlined" color="primary" onClick={() => this.props.fetchTodos()}>
          Refresh
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTodos: () => {
      dispatch(fetchTodos());
    },
    createTodo: (todo) => {
      dispatch(createTodo(todo))
    },
    deleteTodo: (todo) => {
      dispatch(deleteTodo(todo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
