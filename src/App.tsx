import React from 'react'

import './styles.css'

import circlePlus from './assets/circle-plus.svg'
import circleMinus from './assets/circle-minus.svg'

const App = () => {
  return (
    <>
      <h1>Guest Room Allocation Page</h1>
      <div>
        <img src={circlePlus} alt="plus" width="50" height="50" />
        <img src={circleMinus} alt="minus" width="50" height="50" />
      </div>
    </>
  )
}

export default App
