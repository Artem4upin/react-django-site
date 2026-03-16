import React from 'react'
import './Loading.css'

function Loading({ fullPage = false }) {
    return <div className={`loading ${fullPage ? 'loading--fullpage' : ''}`}></div>
}

export default Loading