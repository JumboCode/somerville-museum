
'use client'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

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
