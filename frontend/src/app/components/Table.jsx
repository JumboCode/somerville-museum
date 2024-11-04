//Table.jsx
"use client";  // This directive marks the component as a Client Component
import './Table.css';

const data = [
    { id: 123, name: "Anom", status: 19, tags: "Male" },
    { id: 123, name: "Anom", status: 19, tags: "Male" },
    { id: 123, name: "Anom", status: 19, tags: "Male" },
    { id: 123, name: "Anom", status: 19, tags: "Male" },
]

export default function Table() {
    return (
        <div className="Table">
            <div className="Header">
                <div className="Items">
                    <div className="Searchbar">
                        <input type="text" placeholder="Search..."/>
                    </div>
                        <div className='buttons'> 
                            <button className='addBtn'>ADD</button>
                            <button className='brwBtn'>BORROW</button>
                        </div>
                    </div>
            </div>
            {/* <div className="Itembars">
                <input type="checkbox" className="checkbox" />
                <img class="artwork__image" src="/" />
                
                <button className="dropdown">&#9660;</button>
            </div> */}
            <table>
            <colgroup>
                <col />
                <col span="2" class="batman" />
                <col span="2" class="flash" />
            </colgroup>
                        <th></th>
                        <th></th>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Tags</th>
                        <th></th>
                <tbody>   
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td><input type="checkbox" className="checkbox" /></td>
                                <td><img class="artwork__image" src="/" /></td>
                                <td>{val.id}</td>
                                <td>{val.name}</td>
                                <td>{val.status}</td>
                                <td>{val.tags}</td>
                                <td><button className="dropdown">&#9660;</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}