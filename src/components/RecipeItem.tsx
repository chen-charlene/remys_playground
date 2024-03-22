import React, { useState } from 'react'
import "./RecipeItem.css"
import Heart from "./Heart"

interface RecipeItemProps {
    item: RecipeItemType;
    setHeart: (item: RecipeItemType) => void;
    hearted: boolean;
}

export interface RecipeItemType {
    name: string,
    description: string, 
    image: string, 
    ingredients: {
        name: string, 
        price: number,
        quantity: number
    }[],
    time: number,
    difficulty: number,
}

export default function RecipeItem(props: RecipeItemProps) {
    const imagePath = require(`../${props.item.image}`)

  return (
    <div className="recipe-item-container" onClick={() => props.setHeart(props.item)}>
        <Heart hearted={props.hearted}/>
        <div className="image-container">
            <img className="recipe-image" src={imagePath} alt={props.item.name + ` image`}/>
        </div>
        <div className="body-container">
            <div className="text-container">
                <h2>{props.item.name}</h2>
                <p style={{fontSize:"10px"}}>{props.item.description}</p>
                {/* <div className="overflow-fadeout"></div> */}
            </div>

            <div className="bottom-container">
                <p>Cooking Time: {props.item.time} mins</p>
                <p>Difficulty: {props.item.difficulty}</p>
            </div>
        </div>
    </div>
  )
}
