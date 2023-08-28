function EmailForm(props) {
    const handleSubmit = (event ) => {
      event.preventDefault();
      // Add your logic here to handle form submission
    };
  
    return (props.trigger) ? (
<div className="popup">
      <form onSubmit={handleSubmit}>
        <div className="popup-inner">
        <label htmlFor="to">To:</label>
        <input type="text" id="to" name="to" required /><br />
  
        <label htmlFor="cc">CC:</label>
        <input type="text" id="cc" name="cc" /><br />
  
        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" name="subject" required /><br />
  
        <label htmlFor="body">Body:</label>
        <textarea id="body" name="body" rows="6" required /><br />
  
        <button type="submit">Send Email</button>

        <br></br>
        <button className="close-btn" onClick={() => props.setTrigger(false)}>close</button>
        {props.children}
        </div>
      </form>
      </div>
    ) : ""
    
  }


  export default EmailForm