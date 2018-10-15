import React from "react";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {listUsers} from "../actions/usersAction"
import {connect} from "react-redux"
import Button from "@material-ui/core/Button/Button";

class Users extends React.Component {

  render() {
    return (
      <div>
        <List>
          {this.props.users.map((user) =>
            <ListItem key={user.login.uuid}>
              <Avatar alt={user.name.first + " " + user.name.last} src={user.picture.medium}/>
              <ListItemText primary={user.name.first + " " + user.name.last} secondary={user.email}/>
            </ListItem>
          )}
        </List>
        <Button variant="outlined" color="primary" onClick={() => this.props.listUsers()}>
          Refresh
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users.results
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listUsers: () => {
      dispatch(listUsers());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
