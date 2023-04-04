import React from 'react'
import "./Star.css"
import fullStar from "../../Assets/icons/fullStar.svg"
import emptyStar from "../../Assets/icons/emptyStar.svg"
import halfStar from "../../Assets/icons/halfStar.svg"


const Star = (props: { amount: number }) => {

  const HalfStarImg = () => {
    return (
      <div className='halfStarImg'>
        <img src={emptyStar} alt="" className="stars" />
        <img src={halfStar} alt="" className="stars halfStar" />
      </div>
    )
  }
  
  if (props.amount === 0.5) {
    return (
      <div className='starsContainer'>
        <HalfStarImg/>
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 1) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 1.5) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <HalfStarImg/>
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 2) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 2.5) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <HalfStarImg/>
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 3) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 3.5) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <HalfStarImg/>
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 4) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )
  }
  if (props.amount === 4.5) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <HalfStarImg/>
      </div>
    )
  }
  if (props.amount === 5) {
    return (
      <div className='starsContainer'>
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
        <img src={fullStar} alt="" className="stars" />
      </div>
    )
  }
    return (
      <div className='starsContainer'>
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
        <img src={emptyStar} alt="" className="stars" />
      </div>
    )

}

export default Star