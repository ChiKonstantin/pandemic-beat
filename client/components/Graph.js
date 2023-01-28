import React, { useState, useEffect } from 'react';

export default function Graph() {
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
	return (
		<>
			<canvas
				id={`${countryCode}_chart_plot`}
				width={canvasW}
				height={canvasH}
				className='graph'
			></canvas>
		</>
	);
}
