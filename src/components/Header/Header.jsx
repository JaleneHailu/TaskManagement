import React from 'react'
import './Header.css'

const Header = () => {
return (
    <div className="upperWrapper">
    <div className="pWrapper">
        <div><h3>Welcome back, John Doe</h3></div>
        <div><h1>Avi Trust Homes</h1></div>
    </div>
    <div className="imgWrapper">
        <div>
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3oo0tHTZ0hgXIfdUjC7TIeTOCXhUpvRBd3g&s"
                alt="Profile"
                className="circle-image"
            />
        </div>
    </div>
</div>
)
}

export default Header