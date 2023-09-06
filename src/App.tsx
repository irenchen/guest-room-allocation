import React from 'react'

import './App.css'
import RoomAllocation from './components/RoomAllocation/RoomAllocation'

const App = () => {
  return (
    <div className="container">
      <RoomAllocation
        guest={9}
        room={3}
        onChange={results => {
          console.log({ results })
        }}
      />
    </div>
  )
}

export default App
