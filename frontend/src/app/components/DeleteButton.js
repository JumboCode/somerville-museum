"use client";

function DeleteButton() {

    const handleClick = () => {

        const response = await fetch('http://localhost:5432/query');
        if (!response.ok) {
            throw new Error('Network response was not ok: ${response.statusText');
        }

    }

    return(
        <>

        <button className = "DeleteButton" onClick={handleClick}>
            Click to delete!
        </button>

        <div className = "Data">
            Data will go here!
            {response[0].name}
        </div>

        </>

    );
}

export default DeleteButton;