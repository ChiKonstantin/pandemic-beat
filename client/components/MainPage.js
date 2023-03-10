import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { countriesArr } from '../countries';
import { newCasesData } from '../data/all-countries-new-cases-data';
import { deceasedData } from '../data/all-countries-deceased-data';
import Player from './Player';

import { useSelector, useDispatch } from 'react-redux';
// import sound from './new.wav';

export default function MainPage() {
	console.log('MAIN PAGE///');
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
			return screen.width * 0.8 - 15;
		} else {
			return 500 - 42;
		}
	}

	function generateGraph(countryCode, data, type) {
		const c = document.getElementById(`${countryCode}_chart_${type}`);
		var ctx = c.getContext('2d');
		const casesDataArr = data.filter(
			(elem) => elem.countryCode === countryCode
		)[0].casesArr;
		let r, g, b;
		let sign = 1;
		if (type === 'new_cases') {
			// strokeStyle = '#474DFF';
			r = 0;
			g = 255;
			b = 0;
			sign = 0;
		} else {
			// strokeStyle = '#BF4CCE';
			r = 0;
			g = 0;
			b = 0;
			sign = 0;
		}
		const casesMax = Math.max(...casesDataArr);
		const scaleFactor =
			Math.round(((canvasH - canvasPadding) / casesMax) * 1000000) / 1000000;
		const spacing = canvasW / casesDataArr.length;
		for (let i = 0; i < casesDataArr.length; i++) {
			const topOffset = canvasH - casesDataArr[i] * scaleFactor;
			const leftOffset = spacing * (i + 1);
			ctx.beginPath();
			ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
			ctx.lineWidth = '2';
			ctx.moveTo(leftOffset, canvasH);
			ctx.lineTo(leftOffset, topOffset);
			ctx.stroke();
		}
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
		bringToTop();

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
		newCasesButton.style.backgroundColor = '#00E100';
		deceasedButton.style.backgroundColor = 'grey';
		let newCasesDisplay = '';
		let deceasedDisplay = 'none';
		if (type === 'deceased') {
			newCasesDisplay = 'none';
			deceasedDisplay = '';
			newCasesButton.style.backgroundColor = 'grey';
			deceasedButton.style.backgroundColor = '#00E100';
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

	window.onscroll = function () {
		showToTopButton();
	};

	function showToTopButton() {
		let toTopButton = document.getElementById('to-top-button');
		let countriesTable = document.getElementById('countries_table');
		if (
			document.body.scrollTop > countriesTable.offsetTop ||
			document.documentElement.scrollTop > countriesTable.offsetTop
		) {
			toTopButton.style.visibility = 'visible';
			toTopButton.style.opacity = 1;
		} else {
			toTopButton.style.visibility = 'hidden';
			toTopButton.style.opacity = 0;
		}
	}

	function bringToTop() {
		let countriesTable = document.getElementById('countries_table');
		if (
			Math.max(document.body.scrollTop, document.documentElement.scrollTop) <
			countriesTable.offsetTop - 140
		) {
			return 0;
		} else {
			window.scrollTo({
				top: countriesTable.offsetTop - 140,
				behavior: 'smooth',
			});
		}
	}

	function expandSummary() {
		const resizeDiv = document.getElementById('resize-div');
		const expandedSummary = document.getElementById('expanded-summary');
		expandedSummary.classList.toggle('open');
		if (resizeDiv.innerHTML === 'More...') {
			resizeDiv.innerHTML = 'Less...';
		} else if (resizeDiv.innerHTML === 'Less...') {
			resizeDiv.innerHTML = 'More...';
		}
	}

	return (
		<div id='main-page'>
			{/* <div id='portfolio-div'>Link to my portfolio page.</div> */}
			<div id='top-div'></div>
			<div id='header-wrapper'>
				<div id='header'>Pandemic Beat</div>
				<div id='title-graphics'></div>
			</div>
			{/* <div>by Kostya Balakirev</div> */}

			<div id='summary_div' style={{}}>
				<div id='name-div'>
					{' '}
					<img src='kostya_profile.png' id='profile-pic'></img>{' '}
					<a href='https://www.linkedin.com/in/kbalakirev/' target='_blank'>
						<div id='name'>Kostya Balakirev</div>
					</a>
				</div>
				<hr />
				<p>
					Recently, the world marked the fourth anniversary of the COVID-19
					pandemic. During that time, we have collected a vast amount of data
					describing it, and we are all familiar with how these graphs look. But
					have you ever wondered what they would sound like? After noticing how
					the graphs resembled sound waves, I wrote code to convert COVID-19
					graphs by country into audio files. The results vary depending on the
					amount and quality of data from each country, but most of the sounds
					generated were distinctive.
				</p>
				<div id='expanded-summary' className='expanded-summary'>
					<p>
						The data was sourced from{' '}
						<a
							href='https://health.google.com/covid-19/open-data/raw-data'
							target='_blank'
						>
							Google Open Data
						</a>
						. To make up for the lack of data points (1000 per country, whereas
						a second of audio requires at least 8000 data points at a low 8000
						Hz sample rate) I used linear interpolation.
					</p>
					<p>
						Several observations: Most audios will have a distinctive ???buzz??? due
						to cyclical ups and downs with a period of seven days - these
						oscillations could be due to reporting practices. More on this{' '}
						<a
							href='https://www.sciencedaily.com/releases/2020/07/200714132741.htm'
							target='_blank'
						>
							here
						</a>
						. Some countries will sound more ???staticky??? than the others, like a
						choppy radio signal or a worn-out vinyl record - this is prevalent
						for countries with smaller populations and abrupt data fluctuations.
					</p>
					<p>
						It's easy to forget that behind every number is a story of an actual
						human being and a possible tragedy, let's keep this in mind.
					</p>
					<p>
						If you want to contact me for more details on this project, please
						use my{' '}
						<a href='https://www.linkedin.com/in/kbalakirev/' target='_blank'>
							LinkedIn.
						</a>
					</p>
				</div>
				<div id='resize-div' onClick={expandSummary}>
					More...
				</div>
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
					style={{ backgroundColor: '#00E100' }}
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
				<div id='bottom-div'>
					<div
						id='to-top-button'
						className='button-div'
						// style={{ visibility: 'hidden' }}
						onClick={bringToTop}
					>
						Top
					</div>
				</div>
			</div>
			<table id='countries_table'>
				<tbody>
					{countriesArr.map((countryCode) => (
						<tr>
							<div className='country-element-div'>
								<td className='country-element'>
									<div className='country_name_div'>
										{returnCountryName(countryCode)}
									</div>
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
