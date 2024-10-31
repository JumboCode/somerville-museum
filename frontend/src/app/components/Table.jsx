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
                            
                        </div>
                    </div>
            </div>
            <div className="Itembars">
                <input type="checkbox" className="checkbox" />
                <img class="artwork__image" src="/" />
                <button className="dropdown"></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>   
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td >{val.id}</td>
                                <td>{val.name}</td>
                                <td>{val.status}</td>
                                <td>{val.tags}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}