import React, { useEffect, useRef, useState } from 'react'

import './RoomAllocation.css'

import RoomInput from './RoomInput/RoomInput'

type RoomResult = { adult: number; child: number }

type RoomAllocationResult = RoomResult[]

type Props = {
  guest: number
  room: number
  onChange: (result: RoomAllocationResult) => void
}

const RoomAllocation = ({ guest, room, onChange }: Props) => {
  const [results, setResults] = useState(() =>
    Array(room)
      .fill(null)
      .map(() => {
        return {
          adult: 1,
          child: 0,
        }
      }),
  )

  useEffect(() => {
    onChange(results)
  }, [onChange, results])

  const total = results.reduce((acc, result) => {
    return acc + result.adult + result.child
  }, 0)

  // 避免長按按鈕時，出現下載圖片的contextmenu
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', handler)
    return () => {
      document.removeEventListener('contextmenu', handler)
    }
  }, [])

  const disabled = guest === room

  const invalidGuestRoom = guest < room || guest > room * 4

  const availableRef = useRef(guest - total)

  if (invalidGuestRoom) {
    return (
      <div className="allocation-container">
        <div className="room-facts">
          住客人數 : {guest}人 / {room}房
        </div>
        <div className="room-error">人數與房間數量不符!</div>
      </div>
    )
  }

  const available = guest - total
  availableRef.current = available

  const message =
    available >= 0
      ? `尚未分配人數 : ${available}人`
      : '人數計算有誤，請聯絡客服人員，謝謝!'

  return (
    <div className="allocation-container">
      <div className="room-facts">
        住客人數 : {guest}人 / {room}房
      </div>
      <div className="room-message">{message}</div>

      {Array(room)
        .fill(0)
        .map((_, idx) => {
          return (
            <RoomInput
              key={`room${idx}`}
              name={`room${idx}`}
              available={available}
              availableRef={availableRef}
              disabled={disabled}
              onChange={roomResult => {
                setResults(r => {
                  const rr = [...r]
                  rr[idx] = roomResult
                  return rr
                })
              }}
            />
          )
        })}
    </div>
  )
}

export default RoomAllocation
