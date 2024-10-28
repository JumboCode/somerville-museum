
//!IMPORTANT
//Use the SelectItem button component created by Dan and Elisa, to select an item based on a particular id.
//IMPORTANT
import './ExpandedEntry.css';

function ExpandedEntry() {
    return (
        <div className="overlay">
            <div className="popup">
                <div className="header">
                    <div className="image-placeholder">
                        <img className="image-icon"
                            src="https://www.hagca.com/uploads/1/2/7/1/127145683/holden-kittelberger-headshot_orig.jpg"
                            alt="Holden Kittelberger"
                        />
                    </div>
                    
                    <div className="item-details">
                        <h2 className="item-title">Item</h2>
                        <div className="item-id">ID: ABC123</div>
                        <div className="status">Status: Borrowed</div>
                        <div className="tags">Tags: 
                            <span className="tag"></span>
                            <span className="tag"></span>
                            <span className="tag"></span>
                        </div>
                    </div>
                    
                    <div className="borrower-info">
                        <p>Borrower: John Smith</p>
                        <p>Email: John.Smith@xxxx.xxx</p>
                        <p>Cell: (XXX) XXX-XXXX</p>
                        <p>Date Borrowed: XX/XX/XXXX</p>
                        <p>Return Date: XX/XX/XXXX</p>
                        <p className="approval">Approved By: J. Appleseed</p>
                    </div>
                </div>
                
                <div className="content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.</p>
                </div>
                
                <div className="actions">
                    <button className="button button-edit">🖊️ Edit</button>
                    <button className="button button-return">Return</button>
                </div>
            </div>
        </div>
    );
  }

  export default ExpandedEntry;
