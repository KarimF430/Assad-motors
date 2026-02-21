async function testConsultationLead() {
    const payload = {
        name: "Test User Invalid",
        phone: "+91 98765 43210",
        email: "testinvalid@example.com",
        city: "Mumbai",
        budget: 12345, // Invalid: should be string
        carInterest: "Creta, Nexon, Seltos",
        plannedPurchaseDate: new Date().toISOString(),
        message: "Budget: 10-15 Lakhs"
    };

    console.log('Sending INVALID payload (number budget):', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch('http://localhost:5001/api/consultation-leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Response Status:', response.status);
        const text = await response.text();
        console.log('Response Body:', text);
    } catch (error) {
        console.error('Error:', error);
    }
}

testConsultationLead();
