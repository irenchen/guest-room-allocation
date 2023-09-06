import React, { useEffect, useRef, useState } from 'react'

import './CustomInputNumber.css'

import PlusIcon from './PlusIcon'
import MinusIcon from './MinusIcon'

type CustomInputChangeEvent = {
  target: {
    name: string
    value: number
  }
}

type CustomInputBlurEvent = {
  target: {
    name: string
    value: number
  }
}

type Props = {
  max: number
  min: number
  step: number
  name: string
  value: number
  disabled: boolean
  available: number
  onChange: (e: CustomInputChangeEvent) => void
  onBlur: (e: CustomInputBlurEvent) => void
}

const THROTTLE_PERIOD = 300
const MAX_CLICK_DURATION = 300

const CustomInputNumber = ({
  min,
  max,
  step,
  name,
  value,
  disabled,
  available,
  onChange,
  onBlur,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const counterRef = useRef(value)
  const [counter, setCounter] = useState(value)

  const satisfied = available === 0

  // 動態修正可連續新增的上限人數
  const maxValue =
    counterRef.current + available < max ? counterRef.current + available : max

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const verifyCounter = (value: number) => {
    if (value < min) return min
    if (value > maxValue) return maxValue
    return value
  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = +e.target.value.slice(0, 2)

    inputRef.current!.value = e.target.value
    setCounter(value)
  }

  const [focus, setFocus] = useState(false)

  const onInputFocus = () => {
    signal.current = 0
    setFocus(true)
  }

  const onInputBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    setFocus(false)

    if (e.target.value === '') return

    const value = Math.round(+e.target.value.slice(0, 2))
    const newValue = verifyCounter(value)
    setCounter(newValue)
    counterRef.current = newValue

    inputRef.current!.value = ''

    onChange({
      target: {
        name,
        value: newValue,
      },
    })
    onBlur({
      target: {
        name,
        value: newValue,
      },
    })
  }

  const signal = useRef<-1 | 0 | 1>(0)
  const downTime = useRef(Date.now())

  const timer = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    timer.current = setInterval(() => {
      if (signal.current === 0) return

      if (signal.current === -1) {
        if (Date.now() - downTime.current > THROTTLE_PERIOD) {
          downTime.current = Date.now()
          setCounter(c => verifyCounter(c - step))
          if (counterRef.current !== verifyCounter(counterRef.current - step)) {
            counterRef.current = verifyCounter(counterRef.current - step)
            onChange({
              target: {
                name,
                value: counterRef.current,
              },
            })
          }
        }
      }

      if (signal.current === 1) {
        if (Date.now() - downTime.current > THROTTLE_PERIOD) {
          downTime.current = Date.now()
          setCounter(c => verifyCounter(c + step))
          if (counterRef.current !== verifyCounter(counterRef.current + step)) {
            counterRef.current = verifyCounter(counterRef.current + step)
            onChange({
              target: {
                name,
                value: counterRef.current,
              },
            })
          }
        }
      }
    }, 100)

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCounter, step, available])

  const minusStart = useRef(Date.now())

  const onMinusDown = () => {
    if (disabled) return

    downTime.current = Date.now()
    minusStart.current = Date.now()
    signal.current = -1
  }

  const onMinusUp = () => {
    signal.current = 0

    const delta = Date.now() - minusStart.current
    if (delta < MAX_CLICK_DURATION) {
      setCounter(c => verifyCounter(c - step))
      counterRef.current = verifyCounter(counterRef.current - step)
      onChange({
        target: {
          name,
          value: counterRef.current,
        },
      })
    }

    onChange({
      target: {
        name,
        value: counterRef.current,
      },
    })
  }

  const plusStart = useRef(Date.now())

  const onPlusDown = () => {
    if (disabled) return

    if (satisfied) return

    downTime.current = Date.now()
    plusStart.current = Date.now()
    signal.current = 1
  }

  const onPlusUp = () => {
    signal.current = 0

    const delta = Date.now() - plusStart.current
    if (delta < MAX_CLICK_DURATION) {
      setCounter(c => verifyCounter(c + step))
      counterRef.current = verifyCounter(counterRef.current + step)
      onChange({
        target: {
          name,
          value: counterRef.current,
        },
      })
    }

    onChange({
      target: {
        name,
        value: counterRef.current,
      },
    })
  }

  const reachMin = counter <= min
  const reachMax = counter >= max

  const diableMinus = reachMin || disabled
  const disablePlus = reachMax || disabled || satisfied

  return (
    <div className="h-container">
      <div
        className="box btn"
        onPointerDown={onMinusDown}
        onPointerUp={onMinusUp}
        onPointerCancel={onMinusUp}
        style={{
          position: 'relative',
          border: diableMinus ? '1px solid #5555' : '1px solid #58fa',
          pointerEvents: diableMinus ? 'none' : 'auto',
        }}
      >
        <MinusIcon
          width="3rem"
          height="3rem"
          color={diableMinus ? '#5555' : '#58ff'}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
          }}
        />
        <div style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="box">
        <label
          htmlFor={name}
          style={{
            color: disabled ? '#5555' : '#000',
            border: focus ? '2px solid #5f5' : '1px solid #5555',
          }}
        >
          {counter}
        </label>
        <input
          type="number"
          pattern="[0-9]*"
          min={min}
          max={max}
          id={name}
          ref={inputRef}
          onChange={onInputChange}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onKeyUp={e => {
            e.key === 'Enter' && inputRef.current!.blur()
          }}
          disabled={disabled}
        />
      </div>
      <div
        className="box btn"
        onPointerDown={onPlusDown}
        onPointerUp={onPlusUp}
        onPointerCancel={onPlusUp}
        style={{
          position: 'relative',
          border: disablePlus ? '1px solid #5555' : '1px solid #58fa',
          pointerEvents: disablePlus ? 'none' : 'auto',
        }}
      >
        <PlusIcon
          width="3rem"
          height="3rem"
          color={disablePlus ? '#5555' : '#58ff'}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
          }}
        />
        <div style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

export default CustomInputNumber
