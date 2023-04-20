import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import winter from './img/000.jpg';
import earlyWinter from './img/001.jpg';
import beginWinder from './img/002.jpg';
import earlySpring from './img/003.jpg';
import spring from './img/004.jpg';
import earlySummer from './img/005.jpg';
import beginSummer from './img/006.jpg';
import summer from './img/007.jpg';


const apiKey = "a14996009fd1cec14f59d1e28fb8f628";


const App = () => {
  const [weatheResult, setWeatherResult] = useState({});
  const [cities, setCities] = useState([]);
  const [temperature, setTemperature] = useState(0);
  const [units, setUnits] = useState('metric');
  const [clothtesIcon, setClothtesIcon] = useState(null);


  // 현재 날짜 및 시간



  // 현재 위치
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCurrentLocation(lat, lon);
    });
  };



  // 현재 위치 날씨
  const getWeatherByCurrentLocation = async (lat, lon) => {
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    try {
      const { data } = await axios.get(weatherUrl);
      setWeatherResult(data);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);



  // API 에서 받아온 현재 날씨
  useEffect(() => {
    if (weatheResult.main) {
      const temperature = Math.floor(weatheResult.main.temp).toFixed(0);
      setTemperature(temperature);
    }
  }, [weatheResult]);



  // 날씨 아이콘
  //WeatherResult.weater[0].icon
  const weathericonUrl =<img src={`http://openweathermap.org/img/wn/${weatheResult.weather && weatheResult.weather[0].icon}.png`}
    alt={`${weatheResult.weather && weatheResult.weather[0].description}`} />;



  // 섭씨/화씨 변환
  const celsiusToFahrenheit = (celsius) => {
    // 섭씨 -> 화씨
    const fahrenheit = (celsius * 9 / 5) + 32;
    return fahrenheit.toFixed(0);
  }

  const fahrenheitToCelsius = (fahrenheit) => {
    // 화씨 -> 섭씨
    const celsius = (fahrenheit - 32) * 5 / 9;
    return celsius.toFixed(0);
  }
  // weatherResult에서 받아 온 현재 온도 값
  useEffect(() => {
    if (weatheResult.main) {
      const temperature = weatheResult.main.temp;
      setTemperature(temperature);
    }
  }, [weatheResult]);

  //버튼 클릭 시 temperature 값을 변환한 값으로 변경
  const handleConvertTemperature = () => {
    if (units === 'metric') {
      // 섭씨 -> 화씨
      const fahrenheit = celsiusToFahrenheit(temperature);

      setUnits('imperial');
      setTemperature(fahrenheit);

    } else if (units === 'imperial') {
      // 화씨 -> 섭씨
      const celsius = fahrenheitToCelsius(temperature);
      setUnits('metric');
      setTemperature(celsius);
    }
  }



  // 지역(지도) 클릭
  const searchWeather = async (cities) => {
    try {
      const { data } = await axios({
        method: 'get',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cities}&appid=${apiKey}`
      });
      setWeatherResult(data);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    setCities(['Seoul', 'Busan', 'Jeonju', 'Inchon', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan'])
  }, []);


  // 기온 따른 옷차림
  const selectClothes = (temperature) => {

    if (temperature <= 4) {
      setClothtesIcon(<img src={winter} />);
    }
    else if (temperature >= 5 && temperature < 9) {
      setClothtesIcon(<img src={earlyWinter} />);
    }
    else if (temperature >= 9 && temperature < 12) {
      setClothtesIcon(<img src={beginWinder} />);
    }
    else if (temperature >= 12 && temperature < 17) {
      setClothtesIcon(<img src={earlySpring} />);
    }
    else if (temperature >= 17 && temperature < 20) {
      setClothtesIcon(<img src={spring} />);
    }
    else if (temperature >= 20 && temperature < 23) {
      setClothtesIcon(<img src={earlySummer} />);
    }
    else if (temperature >= 23 && temperature < 28) {
      setClothtesIcon(<img src={beginSummer} />);
    }
    else {
      setClothtesIcon(<img src={summer} />);
    }
  };

  useEffect(() => {
    if (weatheResult.main) {
      const temperature = weatheResult.main.temp;
      setTemperature(temperature);
      selectClothes(temperature);
    }
  }, [weatheResult]);


  return (
    <div className="AppWrap">
      <div className="AppContentsWrap">
        {
          Object.keys(weatheResult).length !== 0 && (
            <div className="resultWrap">
              <div className="city">
                {weatheResult.name}
              </div>
              <div className="skyIcon">
                {weathericonUrl}
              </div>
              <div className="sky">
                {weatheResult.weather[0].main}
              </div>
              <div className="temperature">
                현재 기온 : {temperature}
                <button onClick={handleConvertTemperature}>
                  {units === 'metric' ? '°C' : '°F'}
                </button>
              </div>
              <div className="clothesImg">
                추천 옷차림 : {clothtesIcon}
              </div>
            </div>
          )
        }
        <div className="cityButtons">
          {cities.map((city) => (
            <button key={city} onClick={() => searchWeather(city)}>
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;