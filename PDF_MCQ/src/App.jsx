import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Input } from './components/InputBox'
function App() {
  function getGreeting(){
    const now=new Date();
    const hours=now.getHours();
    let greeting;

    if (hours >= 5 && hours < 12) {
      greeting = "Good morning!";
  } else if (hours >= 12 && hours < 16) {
      greeting = "Good afternoon!";
  } else if (hours >= 16 && hours < 22) {
      greeting = "Good evening!";
  } else {
      greeting = "Good night!";
  }

  return greeting;

  }

  return (
    <>
        <h1 className="text-3xl font-bold text-center pt-4">
            {getGreeting()}
    </h1>
    <Input/>
    </>
  )
}

export default App
