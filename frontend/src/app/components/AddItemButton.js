
'use client'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


// export default function App( ) {

//     const clickMe = () => {

//     }

//     return (
//         <> 
//             <h1>Buttons?</h1>  
//             <div>
//                 <button onClick={clickMe}>Add Item</button>
//             </div>
//         </>
        
//     )
// }

// const App = () => {
//     const handleClick = () => {
//         PopUp(); 

//     }; 
//     return (
//         <>
//             <h1> button </h1>
//         <div>
//             <button type="button" onClick={handleClick}>
//                 Add Item
//             </button>
//         </div>
//         </>
        
//     );
//   };
  
// export default App;

function popUp() {
    return (
        <>
          <label>
            Item Name: <input name = "itemName" />
          </label>

          <hr /> 

          <label>
            Item Description: <input name = "itemDescription" />
          </label>
        
        </>
    )
}

function handleAdd() {
    return (

        <> </>
    )
}


export default function myForm() {
    return (
        <div>
             <Popup trigger=
                {<button> Add Item </button>} 
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                {popUp()}
                            </div>
                            <div>
                                <button onClick= 
                                   {handleAdd()}>
                                       Add Item
                                </button>
                            </div>
                            <div>
                                <button onClick=
                                    {() => close()}>
                                        Exit
                                </button>
                            </div>
                            
                        </div>
                    )
                }
            </Popup>
        </div>
    )
}
