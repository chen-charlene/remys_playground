import React, { useState } from 'react'
import "./Heart.css"

interface HeartProps {
  hearted: boolean
}


export default function Heart(props: HeartProps) {

  return (
    <div className="heart-container">
        <div className={props.hearted ? "heart heart-highlight" : "heart"}></div>
    </div>
  )
}
