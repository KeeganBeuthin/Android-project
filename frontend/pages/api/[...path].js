import {proxy} from '../../server/proxy'



export default (req, res) => {
  return new Promise((resolve, reject) => {
  console.log('proxy')

    proxy.once("error", reject);

    proxy.web(req, res);
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};