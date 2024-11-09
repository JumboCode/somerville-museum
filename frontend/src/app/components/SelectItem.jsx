"use client"; // Marks this as a client component

export default function SelectItemButton() {
  const handleClick = () => {
    let name = prompt("Please enter item name", "");

    if (name == null || name === "") {
      alert("User cancelled the prompt.");
    } else {
      // Making a GET request to the serverless function endpoint
      fetch(`../../api/selectByName`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify({ name }) // Send the name as a JSON object
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            const itemIds = data.map(item => item.id).join(", ");
            alert(`Item ID(s): ${itemIds}`);
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
