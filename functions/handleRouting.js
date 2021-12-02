const { fetchRobot }  = require('./utils');
const log = false; // toggle for dev testing

exports.handler = async (event) => {
    // validate POST request method
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Request method not allowed.' };

    // parse JSON event body
    let request;
    try { request = await JSON.parse(event.body) }
    catch (error) {
        console.log('Error parsing event body:', error);
        return { statusCode: 400, body: 'Unable to parse handleRouting event' }
    }

    log && console.log('Request Body:', request);
    
    const { loadId = null, x: xCoord = null, y: yCoord = null } = request; 

    // prevent null values while 0 remains valid
    if (loadId === null || xCoord === null || yCoord === null) {
        console.log(`Error deconstructing request, missing required field: ${JSON.stringify(request)}`);
        return { statusCode: 400, body: 'Error deconstructing request, missing required field(s)' }
    }

    // handle POST request
    try {
        const robotRequest  = await fetchRobot(loadId, xCoord, yCoord);
        const { robotId, batteryLevel, distanceToGoal } = robotRequest;

        log && console.log('Request Response:', robotRequest);
        
        if (robotId && batteryLevel && distanceToGoal) return { statusCode: 200, body: JSON.stringify(robotRequest) };
        else return { statusCode: 200, body: 'No nearby robots found' };
    } catch (error) {
        console.log('Error completing handleRouting request:', error);
        return { statusCode: 500, body: 'Error completing handleRouting request' };
    }
};