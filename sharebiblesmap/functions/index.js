const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
// const firebaseHelper = require('firebase-functions-helper'); 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.rob = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (request.method !== 'POST') {
            return response.status(500).json({
                message: "method not permitted"
            })
        }
        
        return admin.database().ref(`geofireRegion/${request.body.region}`)
                .once('value').then(snapshot => {
                    response.status(200).json({
                        region: snapshot.val()
                    });
                })
    });
});
