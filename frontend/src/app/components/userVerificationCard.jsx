export default function userVerificationCard({props}) {
    return (

        <div className="newaccountapprovalbutton">
            <div className="info">
            <h2> {props.name} </h2>
            <p>{props.email}</p>
            </div>
            <div className="buttons">
                <button>Approve</button>
                <button>Deny</button>
            </div>
        </div>            
     
    );
}