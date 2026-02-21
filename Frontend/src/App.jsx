import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import HomePage from './Pages/HomePage'

export default function App() {

  const router = createBrowserRouter([
    {
      path : '/',
      element : <HomePage/>
    }
  ])
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}
