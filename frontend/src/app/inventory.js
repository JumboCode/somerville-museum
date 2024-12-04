// users will be redirected to this page after a successful login attempt
"use client";
import './login.css';

export default function forgot_password () {
    const onButtonClick = () => {
        if (loggedIn) {
          localStorage.removeItem('user')
          props.setLoggedIn(false)
        } else {
          navigate('/login')
        }
    }

    return (
    <div className={'inventory-bg'}>
        <div className="mainContainer">
            <div className={'titleContainer'}>
                <div>I don't think this page was neccessary</div>
            </div>
        </div>
    </div>
    )
}