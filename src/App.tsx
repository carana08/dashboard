// import React from 'react';
//import { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import Weather from './components/Weather';
import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';

import './App.css'

function App() {

	return (
		<Grid container spacing={5}>
			<Grid xs={12} sm={4} md={3} lg={12}><h1>Weather Dashboard</h1>
				<Weather /></Grid>
			<Grid xs={12} sm={4} md={3} lg={6}><Indicator title='Temperatura Máx.' subtitle='Probabilidad' value={0.13} /></Grid>
			<Grid xs={12} sm={4} md={3} lg={6}><Indicator title='Temperatura Mín' subtitle='Probabilidad' value={0.13} /></Grid>
			<Grid xs={12} sm={4} md={3} lg={4}><Indicator title='Velocidad del viento' subtitle='Probabilidad' value={0.13} /></Grid>
			<Grid xs={12} sm={4} md={3} lg={4}><Indicator title='Radiación UV' subtitle='Probabilidad' value={0.13} /></Grid>
			<Grid xs={12} sm={4} md={3} lg={4}><Indicator title='Presión Atmosférica' subtitle='Probabilidad' value={0.13} /></Grid>
			<Grid xs={6} sm={4} md={3} lg={3}><Summary></Summary></Grid>
			<Grid xs={6} sm={4} md={3} lg={9}><BasicTable /></Grid>
			<Grid xs={12} lg={10}>
             <WeatherChart></WeatherChart>
         </Grid>
		 <Grid xs={12} lg={2}>
             <ControlPanel />
         </Grid>
         <Grid xs={12} lg={10}>
             <WeatherChart></WeatherChart>
         </Grid>

		</Grid>
	)
}

export default App;
