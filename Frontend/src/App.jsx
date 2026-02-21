import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import HomePage from './Pages/HomePage'
import ValueToQuestions from './Pages/ValueToQuestions'
import PhotoToQuestions from './Pages/PhotoToQuestions'
import Header from './components/Header'

export default function App() {

  const router = createBrowserRouter([
    {
      path : '/',
      element : <><Header/><HomePage/></>
    },
    {
      path : '/valueInput',
      element : <><Header/><ValueToQuestions/></>
    },
    {
      path : '/imageInput',
      element : <><Header/><PhotoToQuestions/></>
    }
  ])
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}
