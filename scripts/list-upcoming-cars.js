const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001';

async function listUpcomingCars() {
    try {
        const response = await fetch(`${API_BASE}/api/upcoming-cars`);
        const cars = await response.json();

        console.log('Upcoming Cars:');
        cars.forEach(car => {
            console.log(`- ${car.name} (ID: ${car.id})`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listUpcomingCars();
