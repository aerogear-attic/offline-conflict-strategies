import React from "react";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

export default class Users extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "results": [{
        "gender": "female",
        "name": {"title": "miss", "first": "ceylan", "last": "dağlaroğlu"},
        "location": {
          "street": "4679 maçka cd",
          "city": "mardin",
          "state": "hakkâri",
          "postcode": 31668,
          "coordinates": {"latitude": "74.8515", "longitude": "80.5478"},
          "timezone": {"offset": "+3:00", "description": "Baghdad, Riyadh, Moscow, St. Petersburg"}
        },
        "email": "ceylan.dağlaroğlu@example.com",
        "login": {
          "uuid": "34287b95-371d-4af8-8f8d-d17aeb0d489a",
          "username": "ticklishsnake206",
          "password": "kenshin",
          "salt": "BfZN0FH9",
          "md5": "c1a5fca3a67491faba7c3044cbae0a40",
          "sha1": "1ed73dcca83353b7d8bd8901f31d0b5a2f12ab89",
          "sha256": "4b4c05506ce0463f9cc1be869fd53433d49dc1d1e84daa8c8981dc9124a3678d"
        },
        "dob": {"date": "1970-08-21T09:55:48Z", "age": 48},
        "registered": {"date": "2012-07-25T17:23:55Z", "age": 6},
        "phone": "(708)-355-6285",
        "cell": "(365)-262-3417",
        "id": {"name": "", "value": null},
        "picture": {
          "large": "https://randomuser.me/api/portraits/women/87.jpg",
          "medium": "https://randomuser.me/api/portraits/med/women/87.jpg",
          "thumbnail": "https://randomuser.me/api/portraits/thumb/women/87.jpg"
        },
        "nat": "TR"
      }, {
        "gender": "female",
        "name": {"title": "ms", "first": "victoria", "last": "hansen"},
        "location": {
          "street": "511 byvænget",
          "city": "sommersted",
          "state": "midtjylland",
          "postcode": 52176,
          "coordinates": {"latitude": "-40.4547", "longitude": "114.3428"},
          "timezone": {"offset": "+10:00", "description": "Eastern Australia, Guam, Vladivostok"}
        },
        "email": "victoria.hansen@example.com",
        "login": {
          "uuid": "85a84a44-71b5-4ff2-bf01-c77ef40ecdcc",
          "username": "silverbear806",
          "password": "rosie",
          "salt": "69ta6Y2W",
          "md5": "1513426c5eff714be508f88462db93d0",
          "sha1": "e27d75ed048a61d6aa1fda99767296ae692c4ca3",
          "sha256": "b45c65a905b270357530c76d85819bc88db1a9b071d668430b423161af573ef6"
        },
        "dob": {"date": "1982-12-21T10:07:19Z", "age": 35},
        "registered": {"date": "2017-08-09T06:25:28Z", "age": 1},
        "phone": "51847898",
        "cell": "00774762",
        "id": {"name": "CPR", "value": "695045-2460"},
        "picture": {
          "large": "https://randomuser.me/api/portraits/women/14.jpg",
          "medium": "https://randomuser.me/api/portraits/med/women/14.jpg",
          "thumbnail": "https://randomuser.me/api/portraits/thumb/women/14.jpg"
        },
        "nat": "DK"
      }, {
        "gender": "male",
        "name": {"title": "mr", "first": "marcus", "last": "hughes"},
        "location": {
          "street": "6902 tay street",
          "city": "whanganui",
          "state": "nelson",
          "postcode": 21409,
          "coordinates": {"latitude": "43.3841", "longitude": "-167.8049"},
          "timezone": {"offset": "+11:00", "description": "Magadan, Solomon Islands, New Caledonia"}
        },
        "email": "marcus.hughes@example.com",
        "login": {
          "uuid": "cbf291d6-ceee-410c-b7ba-3af906847a0e",
          "username": "bigtiger448",
          "password": "hallo",
          "salt": "I2yZRHrm",
          "md5": "30a6d0bc08b847ba2224af34eccd70d7",
          "sha1": "5e39df4c81fdf7cfb5bb62544fd439c3386ad4d9",
          "sha256": "31a2bdd16990a240d5c6e2fb19af00ded17bead4ac06f481d74924cf654e10b5"
        },
        "dob": {"date": "1963-01-09T18:02:13Z", "age": 55},
        "registered": {"date": "2009-09-30T07:38:49Z", "age": 9},
        "phone": "(479)-781-2824",
        "cell": "(554)-464-8150",
        "id": {"name": "", "value": null},
        "picture": {
          "large": "https://randomuser.me/api/portraits/men/48.jpg",
          "medium": "https://randomuser.me/api/portraits/med/men/48.jpg",
          "thumbnail": "https://randomuser.me/api/portraits/thumb/men/48.jpg"
        },
        "nat": "NZ"
      }, {
        "gender": "male",
        "name": {"title": "mr", "first": "james", "last": "brown"},
        "location": {
          "street": "6815 dufferin st",
          "city": "armstrong",
          "state": "ontario",
          "postcode": "W4L 8E1",
          "coordinates": {"latitude": "-53.6677", "longitude": "77.3528"},
          "timezone": {"offset": "+4:30", "description": "Kabul"}
        },
        "email": "james.brown@example.com",
        "login": {
          "uuid": "4fbdf728-d6db-4843-a1e6-5777cecd14d3",
          "username": "lazypeacock482",
          "password": "shemale",
          "salt": "cHqj8qmc",
          "md5": "6737fa94be9c706c01c3988ac82111fe",
          "sha1": "e88c58ba14099c25fc81339e63d48d731cb80095",
          "sha256": "016b5363b661c3701f9cb8f0a98059643ea46f16f87f42ad100f22384cf2a6ae"
        },
        "dob": {"date": "1964-01-13T22:28:04Z", "age": 54},
        "registered": {"date": "2003-10-11T06:22:47Z", "age": 15},
        "phone": "208-823-2942",
        "cell": "984-528-1517",
        "id": {"name": "", "value": null},
        "picture": {
          "large": "https://randomuser.me/api/portraits/men/28.jpg",
          "medium": "https://randomuser.me/api/portraits/med/men/28.jpg",
          "thumbnail": "https://randomuser.me/api/portraits/thumb/men/28.jpg"
        },
        "nat": "CA"
      }], "info": {"seed": "934c1ce81e7895d9", "results": 4, "page": 1, "version": "1.2"}
    }
  }

  render() {
    return (
      <div>
        <List>
          {this.state.results.map((user) =>
            <ListItem key={user.login.uuid}>
              <Avatar alt={user.name.first + " " + user.name.last} src={user.picture.medium}/>
              <ListItemText primary={user.name.first + " " + user.name.last} secondary={user.email}/>
            </ListItem>
          )}
        </List>
      </div>
    );
  }
}
