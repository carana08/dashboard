//import React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import ControlPanel from './components/ControlPanel';
import WeatherChart from './components/WeatherChart';
import Weather from './components/Weather';//agregado propio
import { WeatherData } from './interfaces/weatherData'; //agregado propio
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';//agrergado propio
import './App.css';
import { faCalendarAlt, faEarth, faLocationDot, faMapPin, faTemperatureHigh, faTemperatureLow } from '@fortawesome/free-solid-svg-icons';

interface RowData {
	rangeHours: string;
	windDirection: string;
}

function App() {

	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);//Agregado propio
	// const [weatherData2, setWeatherData2] = useState({ temp_min: 0, temp_max: 0 });//agrergado propio

	const handleWeatherChange = (data: WeatherData) => {
		setWeatherData(data);
	};//Agregado propio

	{/* 
         1. Agregue la variable de estado (dataTable) y función de actualización (setDataTable).
     */}

	const [rowsTable, setRowsTable] = useState<RowData[]>([])

	// Variable de estado y función de actualización
	const [indicators, setIndicators] = useState<JSX.Element[]>([]);

	// Hook: useEffect
	useEffect(() => {
		(async () => {


			{/* 2. Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */ }

			let savedTextXML = localStorage.getItem("openWeatherMap")
			let expiringTime = localStorage.getItem("expiringTime")

			{/* 3. Obtenga la estampa de tiempo actual */ }

			let nowTime = (new Date()).getTime();

			{/* 4. Realiza la petición asicrónica cuando: 
			(1) La estampa de tiempo de expiración (expiringTime) es nula, o  
			(2) La estampa de tiempo actual es mayor al tiempo de expiración */}

			if (expiringTime === null || nowTime > parseInt(expiringTime)) {

				{/* 5. Request */ }

				let API_KEY = "590e3a9acf390c64ba2bee56065a0366"
				let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
				savedTextXML = await response.text();



				{/* 6. Diferencia de tiempo */ }

				let hours = 1
				let delay = hours * 3600000


				{/* 7. En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */ }

				localStorage.setItem("openWeatherMap", savedTextXML)
				localStorage.setItem("expiringTime", (nowTime + delay).toString())
			}

			// XML Parser
			const parser = new DOMParser();
			const xml = parser.parseFromString(savedTextXML || '', 'application/xml');

			// Arreglo para agregar los resultados
			let dataToIndicators = new Array();

			// Análisis, extracción y almacenamiento del contenido del XML en el arreglo de resultados
			let location = xml.getElementsByTagName('location')[1];
			let geobaseid = location.getAttribute('geobaseid');
			let latitude = location.getAttribute('latitude');
			let longitude = location.getAttribute('longitude');
			

			// Extraer el nombre de la ciudad
			let cityName = xml.getElementsByTagName('name')[0].textContent;

			let tempMin = xml.getElementsByTagName("temperature")[0].getAttribute("min");//agregado propio
			let tempMax = xml.getElementsByTagName("temperature")[0].getAttribute("max");//agregado propio
			let date = xml.getElementsByTagName("time")[0].getAttribute("from");//agregado propio

			//quedarse solo con al fecha y eliminar la hora
				

			{/*Agregado propio*/}
			//temp max en grados centigrados
			if (tempMax !== null) {
			  tempMax = (parseFloat(tempMax) - 273.15).toFixed(2);
			} else {
			  tempMax = "N/A";
			}

			if (tempMin !== null) {
				tempMin = (parseFloat(tempMin) - 273.15).toFixed(2);
			  } else {
				tempMin = "N/A";
			  }

			{/*Agregado propio*/}
			let iconoUbicacion = <FontAwesomeIcon icon={faLocationDot} color='red' size='3x' />
			let iconoFecha = <FontAwesomeIcon icon={faCalendarAlt} color='#CB12F4' size='3x' />
			let iconoLatitud = <FontAwesomeIcon icon={faMapPin} color='#15E55A' size='3x' />
			let iconoLongitud = <FontAwesomeIcon icon={faMapPin} color='#BBBE09' size='3x' />
			let iconoPlaneta = <FontAwesomeIcon icon={faEarth} color='green' size='3x' />
			let iconoTempMax= <FontAwesomeIcon icon={faTemperatureHigh} color='red' size='3x' />
			let iconoTempMin = <FontAwesomeIcon icon={faTemperatureLow} color='#0B61A2' size='3x' />
		  	/****************/
			
			dataToIndicators.push([iconoUbicacion, 'Ciudad', cityName]);
			dataToIndicators.push([iconoPlaneta, 'geobaseid', geobaseid]);
			dataToIndicators.push([iconoLatitud, 'Latituds', latitude]);
			dataToIndicators.push([iconoLongitud, 'Longitud', longitude]);
			dataToIndicators.push([iconoTempMax, 'Temperatura Máxima', tempMax+"°C"]);{/*Agregado propio*/}
			dataToIndicators.push([iconoTempMin, 'Temperatura Mínima', tempMin+"°C"]);{/*Agregado propio*/}
			dataToIndicators.push([iconoFecha, 'Fecha', date?.split("T")[0]]);{/*Agregado propio*/}
			

			console.log(dataToIndicators);

			// Renderice el arreglo de resultados en un arreglo de elementos Indicator
			let indicatorsElements = Array.from(dataToIndicators).map((element) => (
				<Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
			));

			// Modificación de la variable de estado mediante la función de actualización
			setIndicators(indicatorsElements);

			{/* 
                 2. Procese los resultados de acuerdo con el diseño anterior.
                    Revise la estructura del documento XML para extraer los datos necesarios. 
             */}

			let arrayObjects = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {

				let rangeHours = (timeElement.getAttribute("from")?.split("T") ?? "") + " - " + (timeElement.getAttribute("to")?.split("T") ?? "")

				let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " " + timeElement.getElementsByTagName("windDirection")[0].getAttribute("code")

				return { rangeHours, windDirection }

			})

			arrayObjects = arrayObjects.slice(0, 8)

			{/* 3. Actualice de la variable de estado mediante la función de actualización */ }

			// Simular la actualización del estado de rowsTable con los datos procesados
			setRowsTable(arrayObjects);

		})();
	}, []);

	return (
		<Grid container spacing={5}>
			<Grid xs={12} sm={4} md={3} lg={12}>
				<h1>Reporte del Clima</h1>
			</Grid>
			{/* Aquí puedes renderizar tus componentes */}
			<Grid xs={6} sm={4} md={3} lg={4}>
				{indicators[0]}
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={4}>
				{indicators[1]}
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={4}>
				{indicators[6]}
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={6}>
				{indicators[2]}
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={6}>
				{indicators[3]}
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={4}>
				{indicators[4]}
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={4}>
				{indicators[5]}
			</Grid>
			
			<Grid xs={6} sm={4} md={3} lg={4}>
				<Summary />
			</Grid>
			<Grid xs={6} sm={4} md={3} lg={12}>
				{/* Renderizar la tabla básica con los datos */}
				<BasicTable rows={rowsTable} />
			</Grid>
			<Grid xs={12} sm={4} md={3}lg={12}>
				<Grid xs={12} lg={2}>
					<ControlPanel />
					<WeatherChart />
				</Grid>
			</Grid>

			{/*Agregado propio*/}
			<Grid xs={12} sm={4} md={3} lg={12}>
				<h1>Reporte del clima en otras Ciudades</h1>
				<Weather onWeatherChange={handleWeatherChange} />
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={6}>
				<Indicator title="Temperatura Máx." subtitle="Grados Centrigrados" value={weatherData?.main.temp_max ?? 0} />
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={6}>
				<Indicator title="Temperatura Mín." subtitle="Grados Centigrados" value={weatherData?.main.temp_min ?? 0} />
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={4}>
				<Indicator title="Velocidad del viento" subtitle="m/s" value={weatherData?.wind.speed ?? 0} />
			</Grid>
			{/* <Grid xs={12} sm={4} md={3} lg={4}>
        <Indicator title="Radiación UV" subtitle="Probabilidad" value={weatherData?.uv.value ?? 0} />
      </Grid> */}
			<Grid xs={12} sm={4} md={3} lg={4}>
				<Indicator title="Presión Atmosférica" subtitle="hPa" value={weatherData?.main.pressure ?? 0} />
			</Grid>
		</Grid>
	);
}

export default App;