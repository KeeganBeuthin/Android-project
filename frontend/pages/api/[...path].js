import {proxy} from '../../server/proxy'



export default (req, res) => {
  return new Promise((resolve, reject) => {


    proxy.once("error", reject);
    
   
  
    proxy.web(req, res,{
 
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};