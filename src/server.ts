import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  //! END @TODO1
  app.get('/filteredimage?image_url={{URL}}', async(req:Request, res:Response)=>{
    const { image_url} = req.query
    console.log(image_url, 'this is the url')
    if (!image_url){
      return res.status(400).send({message:'image_url is required'})
    }
    
    try {
      const filteredImageUrl= await filterImageFromURL(image_url)
      return res.status(200).sendFile(filteredImageUrl, ()=>{deleteLocalFiles([filteredImageUrl])})
      
    } catch (error) {
      res.status(422).send({message:"Unable to process image"});
      throw error
    }
    
  })
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();