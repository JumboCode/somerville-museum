export default function userVerificationCard({name, email}) {
    return (

        <div className="newaccountapprovalbutton">
            <div className="info">
            <h2> {name} </h2>
            <p>{email}</p>
            </div>
            <div className="buttons">
                <button>Approve</button>
                <button>Deny</button>
            </div>
        </div>            
     
    );
}