import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { countriesArr } from '../countries';
import { newCasesData } from '../data/all-countries-new-cases-data';
import { deceasedData } from '../data/all-countries-deceased-data';
import Player from './Player';

import { useSelector, useDispatch } from 'react-redux';
// import sound from './new.wav';

export default function MainPage() {
	// const dispatch = useDispatch();
	// const [playStatus, setPlayStatus] = useState({});
	// const messages = useSelector((state) => state.messages);
	const canvasW = 500;
	const canvasH = 100;
	const canvasPadding = 5;
	//Handling form input
	const handleChange = (event) => {
		event.persist();
		setValues((state) => ({
			...state,
			[event.target.name]: event.target.value,
		}));
		console.log(event.target.value);
	};

	// function playAudio(event) {
	// 	const country = event.target.id;
	// 	const countryAudio = document.getElementById(`${country}_audio`);
	// 	if (!countryAudio.paused) {
	// 		countryAudio.pause();
	// 		countryAudio.currentTime = 0;
	// 	} else {
	// 		countryAudio.play();
	// 	}
	// }

	// function setPlay(event) {
	// 	const countryCode = event.target.id.slice(0, 2);
	// 	setPlayStatus((state) => ({
	// 		...state,
	// 		[countryCode]: `${countryCode} PLAY`,
	// 	}));
	// }

	// function setStop(event) {
	// 	const countryCode = event.target.id.slice(0, 2);
	// 	setPlayStatus((state) => ({
	// 		...state,
	// 		[countryCode]: `${countryCode} STOP`,
	// 	}));
	// }

	// function returnCountryPlayStatus(country) {
	// 	if (playStatus[country]) {
	// 		return playStatus[country];
	// 	} else {
	// 		return `${country} play`;
	// 	}
	// }

	// function generate150() {
	// 	const arr = [];
	// 	for (let i = 0; i < 151; i++) {
	// 		arr.push(i);
	// 	}
	// 	console.log('100 ARRAY:', arr);
	// 	return arr;
	// }

	function generateGraph(countryCode) {
		const c = document.getElementById(`${countryCode}_chart_plot`);
		var ctx = c.getContext('2d');
		const casesDataArr = newCasesData.filter(
			(elem) => elem.countryCode === countryCode
		)[0].casesArr;
		console.log('CASES DATA ARR ', casesDataArr);
		const casesMax = Math.max(...casesDataArr);
		const scaleFactor =
			Math.round(((canvasH - canvasPadding) / casesMax) * 1000000) / 1000000;
		const spacing = canvasW / casesDataArr.length;
		console.log('CASES MAX, SCALE FACTOR', casesMax, scaleFactor);
		for (let i = 0; i < casesDataArr.length; i++) {
			const topOffset = canvasH - casesDataArr[i] * scaleFactor;
			const leftOffset = spacing * (i + 1);
			ctx.beginPath();
			ctx.strokeStyle = '#C10742';
			ctx.lineWidth = '2';
			ctx.moveTo(leftOffset, canvasH);
			ctx.lineTo(leftOffset, topOffset);
			ctx.stroke();
		}
	}

	function generateChart(countryCode) {
		const ctx = document.getElementById(`${countryCode}_chart`);
		const newCases = newCasesData.filter(
			(elem) => elem.countryCode === countryCode
		)[0].casesArr;
		console.log('NEW CASES ', newCases);
		const myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: newCases,
				datasets: [
					{
						data: newCases,
						borderWidth: 1,
					},
				],
			},
			// options: {
			// legend: {
			// 	display: false,
			// },
			// scales: {
			// 	y: {
			// 		beginAtZero: true,
			// 	},
			// },
			// },
		});
		console.log('CHART GENERATION!!!!');
		return myChart;
	}

	function returnCountryName(countryCode) {
		const countryName = newCasesData.filter(
			(elem) => elem.countryCode === countryCode
		)[0].countryName;
		console.log('COUNTRY NAME:', countryName);
		return countryName;
	}
	// function generateAllCharts(countriesArr) {
	// 	for (let i = 0; i < countriesArr.length; i++) {
	// 		generateChart(countriesArr[i]);
	// 	}
	// }
	useEffect(() => {
		// let chartArr = [];
		for (let i = 0; i < countriesArr.length; i++) {
			// chartArr[i] = generateChart(countriesArr[i]);
			generateGraph(countriesArr[i]);
		}
		// return () => {
		// 	for (let i = 0; i < countriesArr.length; i++) {
		// 		chartArr[i].destroy();
		// 	}
		// };
	});

	function searchCountry() {
		let input, filter, table, tr, countryNameDiv, txtValue;
		input = document.getElementById('search_input');
		filter = input.value.toUpperCase();
		table = document.getElementById('countries_table');
		tr = table.getElementsByTagName('tr');
		for (let i = 0; i < tr.length; i++) {
			countryNameDiv = tr[i].getElementsByClassName('country_name_divs')[0];
			if (countryNameDiv) {
				txtValue = countryNameDiv.textContent || countryNameDiv.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = '';
				} else {
					tr[i].style.display = 'none';
				}
			}
			// console.log('%%%', countryNameDiv);
		}
	}

	function clearSearch() {
		let searchInput = document.getElementById('search_input');
		searchInput.value = '';
		// console.log('**********', searchInput);
		searchCountry();
	}
	return (
		<div>
			<h1>Pandemic Beat</h1>
			<div>Intro here..</div>
			<input
				type='text'
				id='search_input'
				onKeyUp={searchCountry}
				placeholder='Search for country..'
				title='Type in a name'
			/>
			<div className='button-div' onClick={clearSearch}>
				Clear
			</div>
			<div className='button-div'>New Cases</div>
			<div className='button-div'>Deceased</div>
			{/* <div>USA!!!</div>
			<audio
				id='US'
				src={`https://storage.googleapis.com/pandemic_beat_wavs/sound_files_new_cases/US_pandemic_beat.wav`}
			></audio> */}
			{/* <div onClick={playAudio}>play button</div> */}
			<table id='countries_table'>
				{countriesArr.map((countryCode) => (
					<tr>
						{/* <td> */}
						<div className='country_name_divs'>
							{returnCountryName(countryCode)}
						</div>

						{/* <canvas id={`${countryCode}_chart`}></canvas> */}
						<canvas
							id={`${countryCode}_chart_plot`}
							width={canvasW}
							height={canvasH}
							className='graph'
						></canvas>
						<Player country={countryCode} />

						<hr />
						{/* </td> */}
					</tr>
				))}
			</table>
		</div>
	);
}
