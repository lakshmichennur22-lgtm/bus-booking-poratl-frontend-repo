import { useState } from 'react'

export default function SeatMap({ schedule, onHold }: { schedule: any, onHold: (seatIds: number[]) => void }) {
    // For demo: assume schedule.seats is an array of {id:number, label:string, available:boolean}
    const seats = schedule.seats || Array.from({ length: 24 }).map((_, i) => ({ id: i + 1, label: `${i + 1}`, available: Math.random() > 0.2 }))
    const [selected, setSelected] = useState<number[]>([])

    function toggle(id: number) {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 48px)', gap: 8 }}>
                {seats.map((s: any) => (
                    <button key={s.id} disabled={!s.available} onClick={() => toggle(s.id)} style={{ padding: 8, border: selected.includes(s.id) ? '2px solid #0078d4' : '1px solid #ccc' }}>
                        {s.label}
                    </button>
                ))}
            </div>
            <div style={{ marginTop: 8 }}>
                <button onClick={() => onHold(selected)} disabled={selected.length === 0}>Hold {selected.length} seats</button>
            </div>
        </div>
    )
}