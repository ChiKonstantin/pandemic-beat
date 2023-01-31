const router = require('express').Router();
// const generateWav = require('../generateWav');

//apis here...

// router.post('/data-for-wav', async (req, res, next) => {
// 	try {
// 		console.log('API HiT!!!!');
// 		console.log('REQ BODY', req.body);
// 		const allCountriesCasesArr = req.body;

// 		for (let i = 0; i < allCountriesCasesArr.length; i++) {
// 			const response = await generateWav(allCountriesCasesArr[i]);
// 		}

// 		// let i = 0;
// 		// function loopGenerate() {
// 		// 	setTimeout(() => {
// 		// 		generateWav(allCountriesCasesArr[val]);

// 		// 	}, 2000)
// 		// }
// 		res.sendStatus(200);
// 		console.log('WAV file should have been generated');
// 	} catch (error) {
// 		next(error);
// 	}
// });

module.exports = router;
