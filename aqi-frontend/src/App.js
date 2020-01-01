import React from 'react';
import './App.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      loading: false,
      city: 'Mumbai',
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
    this.handleSelect = this.handleSelect.bind(this);
    this.getCityDataAndPopulateForm(this.state.city);
  }

  getCityDataAndPopulateForm(cityName) {
    this.setState({ loading: true });
    fetch(`city?city=${cityName}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        const formData = this.state.formData;
        formData['T'] = Number(response.main.temp);
        formData['TM'] = Number(response.main.temp_max);
        formData['Tm'] = Number(response.main.temp_min);
        formData['H'] = Number(response.main.humidity);
        let pp = 0;
        if (response) {
          if (response.rain && response.rain['3h']) {
            pp = response.rain['3h'];
          }
          else if (response.snow && response.snow['3h']) {
            pp = response.snow['3h'];
          }
        }
        formData['PP'] = Number(pp);
        formData['VV'] = Number((Number(response.visibility) / 1000).toFixed(2));
        formData['V'] = Number((Number(response.wind.speed) * 1000 / 3600).toFixed(2));
        formData['VM'] = Number((Number(response.wind.speed) * 1000 / 3600).toFixed(2));
        this.setState({ formData });
        this.setState({ loading: false });
        this.setState({ result: null });
      });
  }

  handleInput(event) {
    const formData = this.state.formData;
    formData[event.target.id] = Number(event.target.value);
    this.setState({ formData });
  }

  handleSelect(event) {
    const cityName = event.target.value;
    this.setState({ city: cityName }, () => {
      this.getCityDataAndPopulateForm(cityName);
    });
  }

  handleSubmit(event) {
    this.setState({ loading: true });
    this.setState({ result: null });
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
        result: response,
        loading: false
      }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Default form filled for { this.state.city } data. Edit as required and submit.
          </p>
          <form onSubmit={this.handleSubmit}>

            <label>Enter Average Temperature (&deg;C)</label>
            <input type='number' value={this.state.formData.T} id='T' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Max Temperature (&deg;C)</label>
            <input type='number' value={this.state.formData.TM} id='TM' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Min Temperature (&deg;C)</label>
            <input type='number' value={this.state.formData.Tm} id='Tm' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Average Relative Humidity (%)</label>
            <input type='number' value={this.state.formData.H} id='H' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Total Rainfall/Snowmelt (mm)</label>
            <input type='number' value={this.state.formData.PP} id='PP' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Average Visibility (km)</label>
            <input type='number' value={this.state.formData.VV} id='VV' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Average Wind Speed (km/h)</label>
            <input type='number' value={this.state.formData.V} id='V' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <label>Enter Maximum Sustained Wind Speed (km/h)</label>
            <input type='number' value={this.state.formData.VM} id='VM' onChange={this.handleInput} step="0.01" />
            <br /><br />

            <h3>OR</h3>
            <label>Fill with current data for popular cities</label>
            <select value={this.state.city} onChange={this.handleSelect} >
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            <br /><br />

            <input type='submit' disabled={this.state.loading} />

          </form>
          {
            this.state.result && !this.state.loading &&
            <div>AQI Prediction is: {this.state.result}</div>
          }
          {
            this.state.loading &&
            <div>Loading... Please wait...</div>
          }
        </header>
      </div>
    );
  }
}