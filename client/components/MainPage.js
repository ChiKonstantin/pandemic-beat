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
	const canvasW = canvasWidth();
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

	function canvasWidth() {
		if (screen.width * 0.8 < 500) {
			return screen.width * 0.8 - 42;
		} else {
			return 500 - 42;
		}
	}

	function generateGraph(countryCode, data, type) {
		console.log('SCREEN WIDTH', screen.width);
		const c = document.getElementById(`${countryCode}_chart_${type}`);
		var ctx = c.getContext('2d');
		const casesDataArr = data.filter(
			(elem) => elem.countryCode === countryCode
		)[0].casesArr;
		let r, g, b;
		let sign = 1;
		if (type === 'new_cases') {
			// strokeStyle = '#474DFF';
			r = 71;
			g = 77;
			b = 255;
			sign = 1;
		} else {
			// strokeStyle = '#BF4CCE';
			r = 191;
			g = 76;
			b = 201;
			sign = -1;
		}
		const casesMax = Math.max(...casesDataArr);
		const scaleFactor =
			Math.round(((canvasH - canvasPadding) / casesMax) * 1000000) / 1000000;
		const spacing = canvasW / casesDataArr.length;
		for (let i = 0; i < casesDataArr.length; i++) {
			const topOffset = canvasH - casesDataArr[i] * scaleFactor;
			const leftOffset = spacing * (i + 1);
			ctx.beginPath();
			ctx.strokeStyle = `rgb(${r + i * sign}, ${g}, ${b})`;
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
			generateGraph(countriesArr[i], newCasesData, 'new_cases');
			generateGraph(countriesArr[i], deceasedData, 'deceased');
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
			countryNameDiv = tr[i].getElementsByClassName('country_name_div')[0];
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

	function showGraphs(type) {
		let newCasesButton = document.getElementById('new_cases_button');
		let deceasedButton = document.getElementById('deceased_button');
		newCasesButton.style.backgroundColor = 'blue';
		deceasedButton.style.backgroundColor = 'grey';
		let newCasesDisplay = '';
		let deceasedDisplay = 'none';
		if (type === 'deceased') {
			newCasesDisplay = 'none';
			deceasedDisplay = '';
			newCasesButton.style.backgroundColor = 'grey';
			deceasedButton.style.backgroundColor = 'blue';
		}
		let newCasesGraphs = document.getElementsByClassName('new_cases_graphs');
		let deceasedGraphs = document.getElementsByClassName('deceased_graphs');

		const graphsCount = Math.max(newCasesGraphs.length, deceasedGraphs.length);
		for (let i = 0; i < graphsCount; i++) {
			if (newCasesGraphs[i]) {
				newCasesGraphs[i].style.display = newCasesDisplay;
			}

			if (deceasedGraphs[i]) {
				deceasedGraphs[i].style.display = deceasedDisplay;
			}
		}
	}
	return (
		<div id='main-page'>
			<div id='top-div'></div>
			<div id='header-wrapper'>
				<div id='header'>Pandemic Beat</div>
				<div id='title-graphics'></div>
			</div>
			{/* <div>by Kostya Balakirev</div> */}

			<div id='summary_div'>
				1871 is a non-profit digital startup incubator located in the
				Merchandise Mart, Chicago, Illinois.[1] The organization was founded in
				2012 by J.B. Pritzker and is the flagship project of The Chicagoland
				Entrepreneurial Center (CEC), a non-profit organization that supports
				entrepreneurs on their path to building high-growth, sustainable
				businesses that serve as platforms for economic development and civic
				leadership. Led by CEO Betsy Ziegler, 1871 has become a major hub of
				Chicago's technology and entrepreneurial ecosystem and hosts over 400
				early-stage companies as well as nationally recognized accelerators,
				industry-specific incubators, and tech talent schools.[1][2] 1871 was
				recognized in 2019 by UBI Global as the Top Private Business Incubator
				in the World and Most Promising Incubator for Women Founders.
			</div>
			<div id='search-wrap'>
				<input
					type='text'
					id='search_input'
					onKeyUp={searchCountry}
					placeholder='Lookup country...'
					title='Type in a name'
				/>
				<div className='button-div' onClick={clearSearch}>
					Clear
				</div>
			</div>
			<div id='buttons-wrap'>
				<div
					id='new_cases_button'
					className='button-div'
					style={{ backgroundColor: 'blue' }}
					onClick={() => {
						showGraphs('new_cases');
					}}
				>
					Infected
				</div>
				<div
					id='deceased_button'
					className='button-div'
					style={{ backgroundColor: 'grey' }}
					onClick={() => {
						showGraphs('deceased');
					}}
				>
					Deceased
				</div>
			</div>
			{/* <div>USA!!!</div>
			<audio
				id='US'
				src={`https://storage.googleapis.com/pandemic_beat_wavs/sound_files_new_cases/US_pandemic_beat.wav`}
			></audio> */}
			{/* <div onClick={playAudio}>play button</div> */}
			<table id='countries_table'>
				<tbody>
					{countriesArr.map((countryCode) => (
						<tr>
							<div className='country-element-div'>
								<td className='country-element'>
									<div className='country_name_div'>
										{returnCountryName(countryCode)}
									</div>

									{/* <canvas id={`${countryCode}_chart`}></canvas> */}
									<div className='new_cases_graphs'>
										<canvas
											id={`${countryCode}_chart_new_cases`}
											width={canvasW}
											height={canvasH}
										></canvas>
										<Player country={countryCode} type={'new_cases'} />
									</div>
									<div className='deceased_graphs' style={{ display: 'none' }}>
										<canvas
											id={`${countryCode}_chart_deceased`}
											width={canvasW}
											height={canvasH}
										></canvas>
										<Player country={countryCode} type={'new_deceased'} />
									</div>
								</td>
							</div>
						</tr>
					))}
					{/* <p>created by Kostya Balakirev</p> */}
				</tbody>
			</table>
		</div>
	);
}
