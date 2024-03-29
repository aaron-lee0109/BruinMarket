import React, { useState } from "react";
import { storage, db, auth } from "../authentication/Config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { Navbar } from '../components/Navbar'

export const AddProduct = () => {

    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[price, setPrice] = useState('');
    const[image, setImage] = useState(null);
    const[category, setCategory] = useState('');

    const[imageError, setImageError] = useState('');
    const[priceError, setPriceError] = useState('');
    const[successMsg, setSuccessMsg] = useState('');
    const[uploadError, setUploadError] = useState('');

    const user = auth.currentUser;
    
    const imgTypes = ['image/png', 'image/PNG', 'image/jpg', 'image/jpeg']
    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile && imgTypes.includes(selectedFile.type)){
                setImage(selectedFile);
                setImageError('');
            }
            else {
                setImage(null);
                setImageError('Please select a valid image file type (jpg or png)')
            }
        }
        else{
            console.log('Please select your file');
        }
    }

    const handleAddProduct = (e) => {
        //prevent refreshing the page 
        e.preventDefault();
        if(image == null) {
            return;
        }
        if(Number(price) < 0) {
            setPriceError('Please add a valid price');
            return;
        }
        const imgPath = image.name + v4()
        // we store the image name in our firebase storage in folder product images (for ease we put that task in a function)
        const storageRef = ref(storage, `product-images/${imgPath}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // store the product itself in our firestore database
        const colRef = collection(db, 'products');
        const formattedPrice = Intl.NumberFormat("en-US",{ maximumFractionDigits: 2}).format(price.toLocaleString()); 

        // add the image to our storage and show the progress by bytes, if error, then set an upload error
        uploadTask.on('state_changed',snapshot=>{
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
        },error=>setUploadError(error.message),()=>{ // after that, get the URL of the image, and then add the product into our database
            getDownloadURL(uploadTask.snapshot.ref).then(url=>{
                addDoc(colRef, {
                    name,
                    description,
                    price: formattedPrice,
                    imgPath,
                    url, 
                    category,
                    seller: user.displayName,
                    sellerID: user.uid
                }).then(()=>{ // if it was successful, then say it was so, and then reset the form
                    setSuccessMsg('Product added succesfully');
                    setName('');
                    setDescription('');
                    setPrice('');
                    document.getElementById('file').value='';
                    setImageError('');
                    setUploadError('');
                    setTimeout(()=>{
                        setSuccessMsg('')
                    },3000)
                }).catch(error=>setUploadError(error.message));
            })
        })
    }

    // Define category options
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Toys', 'Sports', 'Other'];
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }


    return (
        <div>
            <Navbar />
            <br/>
            <h2 class="header2">Add your product</h2>
            {successMsg&&<>
                <div className='success-msg whitetext'>{successMsg}</div>
                <br/>
            </>}
            <form autoComplete="off" className="form addform form-group" onSubmit={handleAddProduct}>
                <label>Product Name</label>
                <br/>
                <input type="text" className='form-control' required onChange={(e)=>setName(e.target.value)} value={name} />
                <br/>
                <label>Product Description</label>
                <br/>
                <input type="text" className='form-control' required onChange={(e)=>setDescription(e.target.value)} value={description} />
                <br/>
                <label>Product Price</label>
                <br/>
                <input type="number" className='form-control' required onChange={(e)=>setPrice(e.target.value)} value={price} />
                {priceError&&<>
                    <br/>
                    <div className='error-msg'>{priceError}</div>
                </>}
                <br/>
                <label>Product Category</label>
                <br/>
                <select className="form-control" value={category} required onChange={handleCategoryChange}>
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                <br/>
                <label>Product Image</label>
                <br/>
                <input type="file" id='file' className='form-control' required onChange={handleProductImg} />
                {imageError&&<>
                    <br/>
                    <div className='error-msg'>{imageError}</div>
                </>}
                <br/>
                <button type = "submit">ADD</button>
            </form>
            {uploadError&&<>
                    <br/>
                    <div className='error-msg'>{imageError}</div>
                </>}
        </div>
    )
}