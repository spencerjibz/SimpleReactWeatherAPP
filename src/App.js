import React from "react";
 import key from './lib/key'
import $ from "jquery";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $("#result").hide();
  }
  render() {
    return (
      <div className="jumbotron">
        <Header />
        <Form />
      </div>
    );
  }
}
const Header = () => {
  return (
    <div>
      <h1> Weather App</h1>
    </div>
  );
};
class Form extends React.Component {
  constructor() {
    super();
    this.handlechange = this.handlechange.bind(this);
    this.showdata = this.showdata.bind(this);
    this.state = {
      data: [],
      isError: "",
      error: []
    };
  }

  handlechange(e) {
    e.preventDefault();
    let inputEl = document.getElementById("myform");

    let cityName = inputEl.city.value;
    if (cityName.length > 0) {
      let url = `https://api.apixu.com/v1/current.json?key=${key}&q=${cityName}`;

      fetch(url)
        .then(res => res.json())
        .then(res => {
          console.log(res);

          if (res.hasOwnProperty("error") === true) {
            this.setState({ isError: "", error: [res] });
          } else {
            this.setState({ data: [res], isError: "No" });
          }
        });
    }
  }
  showdata() {
    console.log(this.state.data);

    $("#result").show();
  }
  render() {
    const { isError, data, error } = this.state;

    return (
      <div>
        <form onSubmit={this.handlechange} id="myform">
          <label htmlFor="input"> Enter City Name: </label>
          <input type="text" onBlur={this.handlechange} name="city" />
          <button onClick={this.showdata}> Find results </button>
        </form>
        <br />
        {isError == "No"
          ? data.map((result, i) => (
              <Result key={i} error={isError} stats={result} />
            ))
          : error.map((result, i) => <Error key={i} error={result} />)}
      </div>
    );
  }
}
class Result extends React.Component {
  componentDidmount() {
    console.clear();
  }
  render() {
    return (
      <div id="result">
        <ul>
          <li>
            <strong>Location</strong>: {this.props.stats.location.name || null}
          </li>
          <div className="results">
            <h5 style={{ color: "lightblue" }}>Weather Stats </h5>
            <li className="alert alert-info">
              Date and Time :{this.props.stats.location.localtime} <br />
              Temperature:{this.props.stats.current.temp_c} °C <br />
              Condition: {this.props.stats.current.condition.text} <br />
              WindSpeed:{this.props.stats.current.wind_mph} mph
            </li>

            <img src={this.props.stats.current.condition.icon} width="100px" />
          </div>
        </ul>
      </div>
    );
  }
}
class Error extends React.Component {
  render() {
    return (
      <div className="jumbotron " style={{ size: "100px" }}>
        <h2 className="alert alert-warning">
          Code:{this.props.error.error.code}
        </h2>
        <h3 className="alert alert-danger">{this.props.error.error.message}</h3>
      </div>
    );
  }
}
export default App;
