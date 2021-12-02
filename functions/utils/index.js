const fetch = require('node-fetch');
const log = false; // toggle for dev testing

module.exports = {
    fetchRobot: async (loadId, xCoord, yCoord) => {
        // fetch available robots
        const robots = await module.exports.handleAvailableRobots();
        if (!robots || !Array.isArray(robots)) {
            console.log('Unable to fetch available robots.');
            throw new Error('Unable to fetch available robots');
        };
        
        // filter robots by distance & battery level
        const nearestChargedRobot = await module.exports.handleFilterRobots(robots, { loadId, xCoord, yCoord });
        if (!nearestChargedRobot){
            console.log('Unable to locate the nearest robot')
            throw new Error('Unable to locate the nearest robot');
        };

        // validate payload & return
        let payload; 
        try { payload = await module.exports.handleValidatePayload(nearestChargedRobot) } 
        catch(error) {
            console.log('Unable to validate payload:', error);
            throw new Error('Unable to validate payload.');
        }
        
        return payload;
    },
    handleAvailableRobots: async () => {
        let availableRobots;
        try {
            const res = await fetch('https://60c8ed887dafc90017ffbd56.mockapi.io/robots');
            if (res && res.status === 200) availableRobots = await res.json();
        } catch(error) {
            console.log('Error fetching robots:', error) 
            throw new Error('Error fetching robots:', error)
        }
        return availableRobots;
    },
    handleFilterRobots: async (robots, requestRobot) => {
        const { xCoord, yCoord } = requestRobot;
        const distanceUnit = 10;

        var nearby = []; // closest robots
        var chargedNearby = []; // highest battery level
         
        // filter by distance
        robots.map(robot => {
            const { x, y } = robot;
            const diff = Math.sqrt(Math.pow((x - xCoord), 2) + Math.pow(y - yCoord, 2)).toFixed(1); // calculate distance from robots
            if (diff <= distanceUnit) nearby.push({ ...robot, distanceToGoal: diff }); // filter by robots within a 10 units
        });

        log && console.log(`Robots within ${distanceUnit} unit(s)`, nearby);

        // reduce array by battery level 
        if (nearby && nearby.length > 0) {
            chargedNearby = nearby.reduce((prev, current) => {
                let diff = (prev.batteryLevel > current.batteryLevel) ? prev : current;
                return diff;
            }); 
        } 

        log && console.log('Robot with highest charge', chargedNearby);
        return chargedNearby;
    },
    handleValidatePayload: async payload => {
        const { robotId, batteryLevel, distanceToGoal } = payload;
        const validPayload = {
            robotId: Number(robotId) ?? null,
            batteryLevel: Number(batteryLevel) ?? null,
            distanceToGoal: Number(distanceToGoal) ?? null
        };

        if (!validPayload.robotId || !validPayload.batteryLevel || !validPayload.distanceToGoal) {
            console.log('Invalid payload:', payload);
            throw new Error('Invalid payload.');
        } 

        return validPayload;
    }
};