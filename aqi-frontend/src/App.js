import React from 'react';
import './App.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      formData: {
        T: 0,
        TM: 0,
        Tm: 0,
        H: 0,
        PP: 0,
        VV: 0,
        V: 0,
        VM: 0
      }
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(event) {
    const formData = this.state.formData;
    formData[event.target.id] = Number(event.target.value);
    this.setState({ formData });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('predict', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(this.state.formData)
    })
    .then(response => response.json())
    .then(response => this.setState({
      result: response
    }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Fill climate data and click submit.
        </p>
          <form onSubmit={this.handleSubmit}>

            <label>Enter Average Temperature (&deg;C)</label>
            <input type='number' value={this.state.T} id='T' onChange={this.handleInput} step="0.01"/>
            <br/><br/>
            
            <label>Enter Max Temperature (&deg;C)</label>
            <input type='number' value={this.state.TM} id='TM' onChange={this.handleInput} step="0.01"/>
            <br/><br/>

            <label>Enter Min Temperature (&deg;C)</label>
            <input type='number' value={this.state.Tm} id='Tm' onChange={this.handleInput} step="0.01"/>
            <br/><br/>

            <label>Enter Average Relative Humidity (%)</label>
            <input type='number' value={this.state.H} id='H' onChange={this.handleInput} step="0.01"/>
            <br/><br/>

            <label>Enter Total Rainfall/Snowmelt (mm)</label>
            <input type='number' value={this.state.PP} id='PP' onChange={this.handleInput} step="0.01"/>
            <br/><br/>

            <label>Enter Average Visibility (km)</label>
            <input type='number' value={this.state.VV} id='VV' onChange={this.handleInput} step="0.01"/>
            <br/><br/>

            <label>Enter Average Wind Speed (km/h)</label>
            <input type='number' value={this.state.V} id='V' onChange={this.handleInput} step="0.01"/>
            <br/><br/>


            <label>Enter Maximum Sustained Wind Speed (km/h)</label>
            <input type='number' value={this.state.VM} id='VM' onChange={this.handleInput} step="0.01"/>
            <br/><br/>

            <input type='submit' />

          </form>
          {
            this.state.result && 
            <div>AQI Prediction is: {this.state.result}</div>
          }
        </header>
      </div>
    );
  }
}