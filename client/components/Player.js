import React, { useState } from 'react';

export default function Player(props) {
	const { country, type } = props;
	const [playStatus, setPlayStatus] = useState({});
	const [runnerDivName, setRunnerDiv] = useState('runner-div');

	let fileEnding = '';
	if (type === 'new_deceased') {
		fileEnding = '_deceased';
	}

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
			return `Loading...`;
		}
	}
	function playAudio(event) {
		const country = event.target.id;
		const countryAudio = document.getElementById(`${country}_audio_${type}`);
		while (countryAudio.buffered < 7) {
			console.log('%%%%', countryAudio.buffered);
		}
		if (!countryAudio.paused) {
			countryAudio.pause();
			countryAudio.currentTime = 0;
		} else {
			countryAudio.play();
		}
	}

	function setLoaded(event) {
		const countryCode = event.target.id.slice(0, 2);
		document.getElementById(`${countryCode}`).innerText = 'PLAY';
	}

	return (
		<>
			<div className={runnerDivName}></div>
			<audio
				id={`${country}_audio_${type}`}
				// src={`https://storage.googleapis.com/pandemic_beat_wavs/sound_files_${type}/${country}_pandemic_beat${fileEnding}.wav`}
				onEnded={setPlay}
				onPause={setPlay}
				onPlaying={setStop}
				onCanPlayThrough={setLoaded}
			>
				<source
					src={`https://storage.googleapis.com/pandemic_beat_wavs/sound_files_${type}_mp3/${country}_pandemic_beat${fileEnding}.mp3`}
					type='audio/mpeg'
				/>
				<source
					src={`https://storage.googleapis.com/pandemic_beat_wavs/sound_files_${type}/${country}_pandemic_beat${fileEnding}.wav`}
					type='audio/wav'
				/>
			</audio>
			<div className='play-button-wrapper'>
				<div id={`${country}`} className='button-div' onClick={playAudio}>
					{returnCountryPlayStatus(country)}
				</div>
				{/* <div id={`${country}_loaded`} className={'loading-div'}>
					Loading...
				</div> */}
			</div>
		</>
	);
}
