const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (request.method !== 'POST') {
            return response.status(500).json({
                message: "method not permitted"
            })
        }
        response.status(200).json({
            message: 'It worked!'
        });
    });
});
