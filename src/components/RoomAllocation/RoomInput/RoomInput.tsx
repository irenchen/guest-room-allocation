import React, { useState } from 'react'

import './RoomInput.css'

import CustominputNumber from '../CustomInputNumber'

type RoomResult = {
  adult: number
  child: number
}

type Props = {
  name: string
  available: number
  availableRef: React.MutableRefObject<number>
  disabled: boolean
  onChange: (result: RoomResult) => void
}

const RoomInput = ({
  name,
  available,
  availableRef,
  disabled,
  onChange,
}: Props) => {
  const [totalAdult, setTotalAdult] = useState(1)
  const [totalChild, setTotalChild] = useState(0)

  return (
    <div className="room-container">
      <div className="room-state">房間 : {totalAdult + totalChild}人</div>
      <div className="field-adult">
        <div className="label-adult">
          <div className="label-title">大人</div>
          <div className="label-subtitle">年齡20+</div>
        </div>
        <CustominputNumber
          min={1}
          max={4 - totalChild}
          step={1}
          name={`${name}-adult`}
          value={1}
          disabled={disabled}
          available={available}
          availableRef={availableRef}
          onChange={e => {
            setTotalAdult(e.target.value)
            onChange({
              adult: e.target.value,
              child: totalChild,
            })
          }}
          onBlur={() => {}}
        />
      </div>
      <div className="field-child">
        <div className="label-child">
          <div className="label-title">小孩</div>
        </div>
        <CustominputNumber
          min={0}
          max={4 - totalAdult}
          step={1}
          name={`${name}-child`}
          value={0}
          disabled={disabled}
          available={available}
          availableRef={availableRef}
          onChange={e => {
            setTotalChild(e.target.value)
            onChange({
              adult: totalAdult,
              child: e.target.value,
            })
          }}
          onBlur={() => {}}
        />
      </div>
    </div>
  )
}

export default RoomInput
