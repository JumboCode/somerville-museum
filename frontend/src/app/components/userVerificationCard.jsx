/**************************************************************
 *
 *                     UserVerificationCard.jsx
 *
 *        Authors: Massimo Bottari, Elias Swartz
 *           Date: 03/07/2025
 *
 *     Summary: Used with SettingsPage.jsx to display a card for each user that needs to be verified.
 * 
 **************************************************************/

export default function UserVerificationCard({ name, email, onApprove, onDeny }) {
    return (
        <div className="newaccountapprovalbutton">
            <div className="info">
                <h2>{name}</h2>
                <p>{email}</p>
            </div>
            <div className="buttons">
                <button onClick={onApprove}>Approve</button>
                <button onClick={onDeny}>Deny</button>
            </div>
        </div>            
    );
}
