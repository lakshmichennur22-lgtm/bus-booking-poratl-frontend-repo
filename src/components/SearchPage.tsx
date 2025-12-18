import React, { useState } from 'react'
import { bookSeats, cancelBooking, holdSeats, searchBuses } from '../apiClient'
import SeatMap from './SeatMap'

export default function SearchPage() {
    const [from, setFrom] = useState('DEL')
    const [to, setTo] = useState('MUM')
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
    const [results, setResults] = useState<any[]>([])
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null)
    const [holdInfo, setHoldInfo] = useState<any | null>(null)
    const [bookingId, setBookingId] = useState<string | null>(null)

    async function onSearch(e: React.FormEvent) {
        e.preventDefault()
        const r = await searchBuses({ from, to, date })
        setResults(r)
        setSelectedSchedule(null)
        setHoldInfo(null)
        setBookingId(null)
    }

    async function onHold(schedule: any, seatIds: number[]) {
        const payload = { scheduleId: schedule.id, seatIds, holdForSeconds: 120 }
        const h = await holdSeats(payload)
        setHoldInfo(h)
    }

    async function onBook() {
        if (!holdInfo) return
        const b = await bookSeats({ holdId: holdInfo.holdId, customer: { name: 'Demo User', email: 'demo@example.com' } })
        alert('Booked: ' + b.bookingId)
        setBookingId(b.bookingId)
        // You might want to clear hold info after booking
        setHoldInfo(null)
        setSelectedSchedule(null)
    }

    async function onCancel() {
        if (!bookingId) return
        try {
            const result = await cancelBooking(bookingId)
            if (result.ok) {
                alert('Booking cancelled successfully')
                setBookingId(null)
                setHoldInfo(null)
                setSelectedSchedule(null)
            } else {
                alert('Cancellation failed')
            }
        } catch (error) {
            console.error('Cancel error:', error)
            alert('Failed to cancel booking')
        }
    }

    return (
        <div>
            <form onSubmit={onSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input value={from} onChange={e => setFrom(e.target.value)} />
                <input value={to} onChange={e => setTo(e.target.value)} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                <button>Search</button>
            </form>

            <div>
                {results.map(r => (
                    <div key={r.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <b>{r.operator}</b> · {r.startTime} → {r.endTime}
                            </div>
                            <div>
                                <button onClick={() => setSelectedSchedule(r)}>Select seats</button>
                            </div>
                        </div>
                        {selectedSchedule?.id === r.id && (
                            <SeatMap schedule={r} onHold={seats => onHold(r, seats)} />
                        )}
                    </div>
                ))}
            </div>

            {holdInfo && (
                <div style={{ marginTop: 16 }}>
                    <h3>Hold created: {holdInfo.holdId}</h3>
                    <button onClick={onBook}>Confirm & Book</button>
                </div>
            )}

            {bookingId && (
                <div style={{ marginTop: 16 }}>
                    <h3>Your booking ID: {bookingId}</h3>
                    <button onClick={onCancel}>Cancel Booking</button>
                </div>
            )}
        </div>
    )
}
