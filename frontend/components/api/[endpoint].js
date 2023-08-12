export default  function reRoute(req, res) {
    console.log(req)
      const  endpoint  = req.query;
  
  
    const options={        
      method: "get",
      headers: {'Content-Type': 'application/json', 'credentials': 'include',
      },
  }
  const response =  fetch(`http://localhost:9000/${endpoint}`, options)
    
      // Extract the data from the response
      const data =  json.stringify(response);
    
  console.log(response)
      if(!data){
          return <div> Loading...</div>
      }
  
    
      return res.status(200).json(data)
    };