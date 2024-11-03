"use client";  // This directive marks the component as a Client Component


 export default function SelectItemButton({onSelect}) {
     const handleClick = () => {

         // Replace the alert with your actual functionality.
         let name = prompt("Please enter item name", "");

         if (name == null || name == "") {
             alert("User cancelled the prompt.");
         } else {
             // Making a GET request to the 'select' endpoint 
             fetch(`http://localhost:5432/select?name=${name}`, { 
                method: 'GET',
        })
        // Handling the response by converting it to JSON 
        .then(response => response.json()) 

        // Print out the returned IDs from the response
        .then(data => {
            if (data.length > 0) {
                const itemIds = data.map(item => item.id).join(", ");
                alert(`Item ID(s): ${itemIds}`);
                onSelect(itemIds); 
            } else {
                alert("Item not found.");
            }
        })

        .catch(error => {
            console.error('Error fetching item:', error);
            alert('Error fetching item. Please try again later.');
        });
}
};

return (
<button
    className="text-center border p-2 rounded bg-gray-100 hover:bg-gray-200"
    onClick={handleClick}
>
    Select Item
</button>
);
}