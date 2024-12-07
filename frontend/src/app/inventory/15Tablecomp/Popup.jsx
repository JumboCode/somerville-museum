"use client";
import "./Popup.css";


export default function Popup( { unit, onClose } ) {
    if (!unit){
        return null;
    }
    const { id, name, status, tags } = unit;

    return (
        <div class="sidebar">
            <div class="header">
                <h2>{name}</h2>
                <div class="buttons">
                <button class="edit-btn"> Edit </button>
                <button class="close-btn" onClick={onClose}>X</button>
                </div>
            </div>
            
            <div class="item-details">
                <div class="details-left">
                <div class="image-placeholder"></div>
                <p><strong>ID:</strong> {id}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Location:</strong> Shelf H</p>
                </div>
                <div class="details-right">
                </div>
            </div>
            
            <div class="tags-section">
                <h3>Tags:</h3>
                <div class="tags">
                    {tags && tags.length > 0 && tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                </span>
                            ))}
                </div>
            </div>
            
            <div class="notes-section">
                <h3>Notes</h3>
                <textarea></textarea>
            </div>
            
            <div class="borrower-info">
                <h3>Borrower Information</h3>
                <button class="return-btn">Return Item</button>
                <p><strong>Name:</strong> John Smith</p>
                <p><strong>Email:</strong> john.smith@example.com</p>
                <p><strong>Cell:</strong> (XXX) XXX-XXXX</p>
                <p><strong>Date Borrowed:</strong> XX/XX/XXXX</p>
                <p><strong>Return Date:</strong> XX/XX/XXXX</p>
                <p><strong>Approved By:</strong> J. Appleseed</p>
            </div>

            <div class="history-section">
                <h3>Recent Borrower History <a href="#">SEE ALL</a></h3>
                <table>
                <tr>
                    <td>XX/XX/XXXX -- XX/XX/XXXX</td>
                    <td>M. Janet</td>
                    <td>M.Janet@gmail.com</td>
                </tr>
                <tr>
                    <td>XX/XX/XXXX -- XX/XX/XXXX</td>
                    <td>M. Janet</td>
                    <td>M.Janet@gmail.com</td>
                </tr>
                </table>
            </div>
        </div>
    );
}