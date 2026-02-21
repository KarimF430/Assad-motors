async function testRobotsTxt() {
    try {
        const response = await fetch('http://localhost:3000/robots.txt');
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        const text = await response.text();
        console.log('Body:', text);
    } catch (error) {
        console.error('Error fetching robots.txt:', error);
    }
}

testRobotsTxt();
