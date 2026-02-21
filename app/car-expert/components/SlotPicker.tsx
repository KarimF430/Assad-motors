'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './SlotPicker.module.css';

interface SlotPickerProps {
    selectedSlot: { date: string; time: string } | null;
    onSelectSlot: (slot: { date: string; time: string }) => void;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

interface AvailabilityData {
    [date: string]: TimeSlot[];
}

// Generate next 6 days
const generateDates = () => {
    const dates = [];
    const today = new Date();
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            date: date.toISOString().split('T')[0],
            day: i === 0 ? 'TODAY' : i === 1 ? 'TOMORROW' : dayNames[date.getDay()],
            dayNum: date.getDate(),
        });
    }
    return dates;
};

// Categorize time into period
const categorizeTime = (timeStr: string): 'morning' | 'afternoon' | 'evening' => {
    const hour = parseInt(timeStr.split(':')[0]);
    const isPM = timeStr.includes('PM');
    const actualHour = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);

    if (actualHour < 12) return 'morning';
    if (actualHour < 17) return 'afternoon';
    return 'evening';
};

export default function SlotPicker({ selectedSlot, onSelectSlot }: SlotPickerProps) {
    const dates = useMemo(() => generateDates(), []);
    const [selectedDate, setSelectedDate] = useState(dates[0].date);
    const [availability, setAvailability] = useState<AvailabilityData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [slotCounts, setSlotCounts] = useState<{ [date: string]: number }>({});

    // Fetch availability from Calendly
    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            setError(null);

            const startDate = dates[0].date;
            const endDate = dates[dates.length - 1].date;

            try {
                // TODO: Ensure this API endpoint exists or mock it for now
                const response = await fetch(
                    `/api/calendly/availability?start_date=${startDate}&end_date=${endDate}`
                );

                if (!response.ok) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 800));

                    // Mock availability data
                    const mockAvailability: AvailabilityData = {};
                    const mockTimeSlots = [
                        { time: '10:00 AM', available: true },
                        { time: '11:30 AM', available: true },
                        { time: '02:00 PM', available: true },
                        { time: '04:30 PM', available: true },
                        { time: '07:00 PM', available: true },
                        { time: '08:00 PM', available: false }, // Example of an unavailable slot
                    ];

                    dates.forEach(d => {
                        // For some dates, let's make them have fewer slots or no slots
                        if (d.day === 'WED') { // Example: Wednesday has no slots
                            mockAvailability[d.date] = [];
                        } else if (d.day === 'FRI') { // Example: Friday has only morning slots
                            mockAvailability[d.date] = mockTimeSlots.filter(slot => categorizeTime(slot.time) === 'morning');
                        }
                        else {
                            mockAvailability[d.date] = mockTimeSlots;
                        }
                    });

                    setAvailability(mockAvailability);

                    // Calculate slot counts per date from mock data
                    const counts: { [date: string]: number } = {};
                    Object.keys(mockAvailability).forEach(date => {
                        counts[date] = mockAvailability[date].filter(s => s.available).length;
                    });
                    setSlotCounts(counts);

                    setLoading(false);
                } else {
                    // In a real scenario, parse the actual response here
                    const data = await response.json();
                    // Process real data and set availability, slotCounts
                    // For now, we'll just use the mock data if the response is OK too,
                    // or you can implement actual data processing.
                    console.log("Real API response (not mocked yet):", data);
                    // For demonstration, let's still use mock data even if response.ok is true
                    // You would replace this with actual data processing.
                    const mockAvailability: AvailabilityData = {};
                    const mockTimeSlots = [
                        { time: '10:00 AM', available: true },
                        { time: '11:30 AM', available: true },
                        { time: '02:00 PM', available: true },
                        { time: '04:30 PM', available: true },
                        { time: '07:00 PM', available: true },
                        { time: '08:00 PM', available: false },
                    ];
                    dates.forEach(d => {
                        mockAvailability[d.date] = mockTimeSlots;
                    });
                    setAvailability(mockAvailability);
                    const counts: { [date: string]: number } = {};
                    Object.keys(mockAvailability).forEach(date => {
                        counts[date] = mockAvailability[date].filter(s => s.available).length;
                    });
                    setSlotCounts(counts);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch availability:", err);
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [dates]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time: string) => {
        onSelectSlot({ date: selectedDate, time });
    };

    const isTimeSelected = (time: string) => {
        return selectedSlot?.date === selectedDate && selectedSlot?.time === time;
    };

    // Get slots for selected date
    const slotsForDate = availability[selectedDate] || [];

    const morningSlots = slotsForDate.filter(s => categorizeTime(s.time) === 'morning');
    const afternoonSlots = slotsForDate.filter(s => categorizeTime(s.time) === 'afternoon');
    const eveningSlots = slotsForDate.filter(s => categorizeTime(s.time) === 'evening');

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.title}>AVAILABILITY</h3>
                <div className={styles.timezone}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>Asia/Kolkata</span>
                </div>
            </div>

            {/* Date Picker Strip */}
            <div className={styles.dateStrip}>
                {dates.map((d) => (
                    <button
                        key={d.date}
                        onClick={() => handleDateSelect(d.date)}
                        className={`${styles.dateCard} ${selectedDate === d.date ? styles.dateCardActive : ''}`}
                    >
                        <span className={styles.dayLabel}>{d.day}</span>
                        <span className={styles.dayNum}>{d.dayNum}</span>
                        <span className={styles.slotsLabel}>
                            {loading ? '...' : `${slotCounts[d.date] || 0} slots`}
                        </span>
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading availability...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                        Retry
                    </button>
                </div>
            )}

            {/* Time Slots */}
            {!loading && !error && (
                <div className={styles.slotsContainer}>
                    {morningSlots.length > 0 && (
                        <>
                            <h4 className={styles.slotGroupTitle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                                Morning
                            </h4>
                            <div className={styles.slotsGrid}>
                                {morningSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                                        disabled={!slot.available}
                                        className={`${styles.slotBtn} ${isTimeSelected(slot.time) ? styles.slotBtnActive : ''} ${!slot.available ? styles.slotBtnDisabled : ''}`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {afternoonSlots.length > 0 && (
                        <>
                            <h4 className={styles.slotGroupTitle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
                                </svg>
                                Afternoon
                            </h4>
                            <div className={styles.slotsGrid}>
                                {afternoonSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                                        disabled={!slot.available}
                                        className={`${styles.slotBtn} ${isTimeSelected(slot.time) ? styles.slotBtnActive : ''} ${!slot.available ? styles.slotBtnDisabled : ''}`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {eveningSlots.length > 0 && (
                        <>
                            <h4 className={styles.slotGroupTitle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                                Evening
                            </h4>
                            <div className={styles.slotsGrid}>
                                {eveningSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                                        disabled={!slot.available}
                                        className={`${styles.slotBtn} ${isTimeSelected(slot.time) ? styles.slotBtnActive : ''} ${!slot.available ? styles.slotBtnDisabled : ''}`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {slotsForDate.length === 0 && (
                        <div className={styles.noSlots}>
                            <p>No available slots for this date</p>
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <p className={styles.infoText}>
                A consultation with our expert generally takes 15-30 minutes.
            </p>
        </div>
    );
}
