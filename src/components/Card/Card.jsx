import React from 'react'
import './Card.css'

const Card = () => {
return (
    <div className="cardWrapper">
                <p style={{ fontSize: '13px' }} className="percentage">
                    <b>Your Team was 50% Effective this week</b>
                </p>
                <div className="spinner-container">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
            </div>
)
}

export default Card