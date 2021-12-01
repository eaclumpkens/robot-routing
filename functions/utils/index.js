const fetch = require('node-fetch');
const log = true; // toggle for dev testing

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
        
        const { robotId, batteryLevel, distanceToGoal } = nearestChargedRobot;
        const payload = {
            robotId,
            batteryLevel,
            distanceToGoal
        };
        
        // validate & return nearest robot with highest battery level
        return payload;
    },
    handleAvailableRobots: async () => {
        let availableRobots;
        
        await fetch('https://60c8ed887dafc90017ffbd56.mockapi.io/robots', { httpMethod: 'GET'})
            .then(async res => {
                if (res && res.status === 200) availableRobots = await res.json();
            }).catch(error => { 
                console.log('Error fetching robots:', error) 
                throw new Error('Error fetching robots:', error)
            });
            
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
    }
};