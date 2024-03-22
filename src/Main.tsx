import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./Main.css"

import recipeData from "./assets/recipe-data.json";
import RecipeItem, { RecipeItemType } from './components/RecipeItem';
import remyImg from "./images/remy.png"
import remyImg2 from "./images/remy2.png"
import { StepIndicatorProps } from '@chakra-ui/react';

export interface dictionaryItem {[key: string]: {[key: string]: {name: string, details: {price: number, quantity: number}}}}
export interface heartDict {[key:string]: boolean}
export interface menuItem {[key: string]: {name: string, price: number, quantity: number}[]}

export default function Main() {
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const [sortIsOpen, setSortIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Filter by...")
    const [selectedSorting, setSelectedSorting] = useState("Sort by...")
    const [dictionary, setDictionary] = useState<dictionaryItem>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [menu, setMenu] = useState<menuItem>({});
    const [hearted, setHearted] = useState<heartDict>({})

    useEffect(() => {
        setFilterIsOpen(false)
    }, [selectedFilter])

    useEffect(() => {
        setSortIsOpen(false)
    }, [selectedSorting])


    const toggleFilter = () => {
        setFilterIsOpen(!filterIsOpen);
    }

    const selectFilter = (filter: string) => {
        setSelectedFilter(filter);
    }

    const toggleSort = () => {
        setSortIsOpen(!sortIsOpen);
    }

    const selectSort = (sort: string) => {
        setSelectedSorting(sort)
    }

    const toggleReset = () => {
        setSelectedFilter("Filter by...")
        setSelectedSorting("Sort by...")
    }

    const filterRecipe = (recipes: RecipeItemType[]) => {
        switch (selectedFilter) {
            case "Beginner Friendly":
                return recipes.filter(recipe => {
                    if (recipe.difficulty <= 3) {
                        return true
                    } else return false
                })
            case "Advanced Chef":
                return recipes.filter(recipe => {
                    if (recipe.difficulty > 3) {
                        return true
                    } else return false
                })
            case "<30 minutes":
                return recipes.filter(recipe => {
                    if (recipe.time <= 30) {
                        return true
                    } else return false
                })
            case ">30 minutes":
                return recipes.filter(recipe => {
                    if (recipe.time > 30) {
                        return true
                    } else return false
                })
            default: return recipes
        }
    }

    const sortRecipe = (recipes: RecipeItemType[]) => {
        switch (selectedSorting) {
            case "Alphabetical (a-z)":
                return recipes.slice().sort((a,b) => a.name.localeCompare(b.name));
            case "Alphabetical (z-a)":
                return recipes.slice().sort((a,b) => b.name.localeCompare(a.name));
            default: return recipes
        }
    }

    const setHeart = (item: RecipeItemType) => {
        console.log("INSIDE SET HEAR")
        const updatedHeartedDict = {...hearted}
        updatedHeartedDict[item.name] = !hearted[item.name]
        setHearted(updatedHeartedDict)
        if (!hearted[item.name]) {
            addToList(item.name, item.ingredients)
        } else {
            removeFromList(item.name, item.ingredients)
        }
    }

    const buildRecipeElements = () => {
        const filteredRecipe = filterRecipe(recipeData)
        const sortedRecipe = sortRecipe(filteredRecipe)
        const jsxList = sortedRecipe.map((item, index) => (
            <RecipeItem item={item} setHeart={setHeart} hearted={hearted[item.name]}/>
          ))
        return jsxList
    }

    const removeFromList = (name: string, ingredients: {name:string, price: number, quantity: number}[]) => {
        const updatedDictionary = {...dictionary};
        let currPrice = totalPrice
        for (let ingredient of ingredients) {
            updatedDictionary[name][ingredient.name].details.quantity -= ingredient.quantity;
            currPrice -= ingredient.price
            if (updatedDictionary[name][ingredient.name].details.quantity == 0) {
                delete updatedDictionary[name][ingredient.name]
            }
        }
        const updatedMenuDict = {...menu}
        for (let key of Object.keys(menu)) {
            if (key == name) {
                delete updatedMenuDict[key]
            }
        }


        const updatedHeartedDict = {...hearted}
        updatedHeartedDict[name] = false
        setHearted(updatedHeartedDict)

        setMenu(updatedMenuDict)
        setTotalPrice(currPrice)
        setDictionary(updatedDictionary)
    }

    const addToList = (name: string, ingredients: {name:string, price: number, quantity: number}[]) => {
        let currPrice = totalPrice
        const updatedDictionary = {...dictionary};
        for (let ingredient of ingredients) {
            if (updatedDictionary[name] == undefined) {
                updatedDictionary[name] = {}
            }
            if (updatedDictionary[name][ingredient.name] == undefined) {
                updatedDictionary[name][ingredient.name] = {
                    name: ingredient.name,
                    details: {
                        price: ingredient.price,
                        quantity: ingredient.quantity,
                    }
                }
            } else {
                updatedDictionary[name][ingredient.name].details.quantity += ingredient.quantity;
            }
            currPrice += ingredient.price
        }
        setMenu(prevMenu => {
            const updatedMenu = {...prevMenu}
            if (!updatedMenu[name]) {
                updatedMenu[name] = []
            } 
            updatedMenu[name] = ingredients
            return updatedMenu
        })
        setTotalPrice(currPrice)
        setDictionary(updatedDictionary)
    }

    const displayList = () => {
        const listItems = [];
        for (let i in dictionary) {
            for (let j in dictionary[i]) {
                listItems.push(
                    <div className="row-container">                  
                        <div className="name-container">
                            <p key={i}>{dictionary[i][j].name}</p>
                        </div>
                        <div className="quantity-container">
                            <p key={i}> ... {dictionary[i][j].details.quantity}x</p>
                        </div>
                    </div>
                );
            }
        }
        return listItems;
    }

    const displayMenu = () => {
        const menu_items = []
        for (let item of Object.keys(menu)) {
            menu_items.push(
                <div onClick={() => {removeFromList(item, menu[item])}} className="menu-name-container" key={item}>
                    <p style={{color: "white"}}>{item}</p>
                </div>
            )
        }
        return menu_items
    }



  return (
    <div className="body">
        <div className="header"><h1>REMY's PLAYGROUND</h1></div>
        <div className="container">
            <div className="left-container">
                <div className="display-box">
                    <div className="filter-container">
                        <div className="btn-group-custom">
                            <button type="button" className="btn btn-danger dropdown-toggle filter-button btn-style" onClick={toggleFilter} data-toggle="dropdown" aria-haspopup="true" aria-expanded={filterIsOpen ? "true" : "false"}>
                                {selectedFilter}
                            </button>
                            <div className={`dropdown-menu ${filterIsOpen ? 'show':''}  dropdown-style`}>
                                <div className="dropdown-item" onClick={() => selectFilter("Beginner Friendly")}>Beginner Friendly</div>
                                <div className="dropdown-item" onClick={() => selectFilter("Advanced Chef")}>Advanced Chef</div>
                                <div className="dropdown-item" onClick={() => selectFilter("<30 minutes")}>{'<'}30 minutes</div>
                                <div className="dropdown-item" onClick={() => selectFilter(">30 minutes")}>{'>'}30 minutes</div>
                            </div>
                        </div>

                        <div className="btn-group-custom">
                            <button type="button" className="btn btn-danger dropdown-toggle filter-button btn-style" onClick={toggleSort} data-toggle="dropdown" aria-haspopup="true" aria-expanded={sortIsOpen ? "true" : "false"}>
                                {selectedSorting}
                            </button>
                            <div className={`dropdown-menu ${sortIsOpen ? 'show':''}  dropdown-style`}>
                                <div className="dropdown-item" onClick={() => selectSort("Alphabetical (a-z)")}>Alphabetical (a-z)</div>
                                <div className="dropdown-item" onClick={() => selectSort("Alphabetical (z-a)")}>Alphabetical (z-a)</div>
                            </div>
                        </div>

                        <div className="btn-group-custom">
                            <button type="button" className="btn btn-danger filter-button btn-style" onClick={toggleReset} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Reset
                            </button>
                        </div>
                    </div>



                    <div className="recipe-container">
                        {buildRecipeElements()}
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="triangle-container">
                    <div className="triangle"></div>
                    <div className="triangle"></div>
                    <div className="triangle"></div>
                    <div className="triangle"></div>
                    <div className="circle"></div>
                    <div className="triangle"></div>
                    <div className="triangle"></div>
                    <div className="triangle"></div>
                    <div className="triangle"></div>
                </div>
                <div className="list-container">
                    <div className="ingredients-container">
                        <h2>SHOPPING LIST RECEIPT</h2>
                        <div className="divider"></div>
                        <div className="list-body">
                            {displayList()}
                        </div>
                        <div className="list-bottom">
                            <h2>Total: ${Math.abs(parseFloat(totalPrice.toFixed(2)))}</h2>
                        </div>
                    </div>
                </div>
                <div className="triangle-container">
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                    <div className="triangle flipped"></div>
                </div>


                <div className="menu-container">
                    <h2 style={{color: "white"}}>UPCOMING MENU...</h2>
                    <div className="menu-body">
                        {displayMenu()}
                    </div>
                </div>
            </div>
        </div>
        <div className="remy-container">
            <img src={remyImg}></img>
        </div>
        <div className="remy2-container">
            <img src={remyImg2}></img>
        </div>
    </div>
  )
}
