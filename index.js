import express from 'express';
import * as dotenv from 'dotenv'; //TO load Env file into process
import cors from 'cors'; //This is Used for cross origin request
import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';



dotenv.config(); //To use ENvironment Variable we call that

const app = express();

app.use(cors()); //App.use to add midlle ware and cors telling you are allowed to allowing requests from different origins to access your API endpoints. 
app.use(express.json({ limit: '50mb' })); //it is again middleware to have json content

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.use('/api/v1/users',userRouter);
app.use('/api/v1/property',propertyRouter);

const startServer = async () => {

    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(4500,()=>console.log('SERVER STARTED on http://localhost:4500'));
    } catch (error) {
        console.log(error);
    }
}
 
startServer();



//2:14 Frontent Start
//2:31Frontend