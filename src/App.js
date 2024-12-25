import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { publicRoutes } from '~/routes'
import { DefaultLayout } from './components/Layout'
import { useCallback, useEffect, useState } from 'react'
import ReceiveNotification from './utils/receiveNotification' // Correct casing
function App() {
  return (
    <Router>
      <div className="App">
        <ReceiveNotification /> {/* Include the ReceiveNotification component */}
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.layout || DefaultLayout
            const Page = route.component
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            )
          })}
        </Routes>
      </div>
    </Router>
  )
}

export default App
