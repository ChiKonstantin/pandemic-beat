import React, { useState } from 'react';

export default function Player(props) {
	const { country } = props;
	const [playStatus, setPlayStatus] = useState({});
	const [runnerDivName, setRunnerDiv] = useState('runner-div');

	function setPlay(event) {
		const countryCode = event.target.id.slice(0, 2);
		setPlayStatus((state) => ({
			...state,
			[countryCode]: `PLAY`,
		}));
		setRunnerDiv(() => 'runner-div');
	}

	function setStop(event) {
		const countryCode = event.target.id.slice(0, 2);
		setPlayStatus((state) => ({
			...state,
			[countryCode]: `STOP`,
		}));
		setRunnerDiv(() => 'runner-div-animated');
	}

	function returnCountryPlayStatus(country) {
		if (playStatus[country]) {
			return playStatus[country];
		} else {
			return `play`;
		}
	}
	function playAudio(event) {
		const country = event.target.id;
		const countryAudio = document.getElementById(`${country}_audio`);
		if (!countryAudio.paused) {
			countryAudio.pause();
			countryAudio.currentTime = 0;
		} else {
			countryAudio.play();
		}
	}

	return (
		<>
			<div className={runnerDivName}></div>
			<audio
				id={`${country}_audio`}
				src={`https://storage.googleapis.com/pandemic_beat_wavs/sound_files_new_cases/${country}_pandemic_beat.wav`}
				onEnded={setPlay}
				onPause={setPlay}
				onPlay={setStop}
			></audio>
			<div id={`${country}`} className='button-div' onClick={playAudio}>
				{returnCountryPlayStatus(country)}
			</div>
		</>
	);
}
