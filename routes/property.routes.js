import express from 'express';
import {
    getAllProperty,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/property.controller.js';

const router = express.Router();

//We can also add middle ware as router.use((req,res,next)=>{
    //next();
//})

router.route('/').get(getAllProperty);
router.route('/:id').get(getPropertyDetail);
router.route('/').post(createProperty);
router.route('/:id').patch(updateProperty);//Means Update
router.route('/:id').delete(deleteProperty);

export default router;