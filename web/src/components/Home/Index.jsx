// import logo from './logo.svg';
// import './App.css';
import { useFormik } from 'formik';
import "./index.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as yup from 'yup';
import axios from "axios";
import { useEffect, useState } from 'react';

const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 370,
  };

function Home() {
    const [open, setOpen] = useState(false);
    const handleOpenClose = () => setOpen(!open);

    const [openEdit, setOpenEdit] = useState(false);
    const handleEditOpenClose = () => setOpenEdit(!openEdit);

    const [products, setProducts] = useState([])
    const [loadProduct, setLoadProduct] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)

    const baseURI = "https://e-commerce-sever-saad.cyclic.app";


    const getAllProducts = async () => {
        try {
            const response = await axios.get(`${baseURI}/products`)
            console.log("response: ", response.data);

            setProducts(response.data.data)

        } catch (error) {
            console.log("error in getting all products", error);
        }
    }

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`${baseURI}/products/${id}`)
            console.log("response: ", response.data);

            setLoadProduct(!loadProduct)

        } catch (error) {
            console.log("error in getting all products", error);
        }
    }

    const editMode = (product) => {
        setIsEditMode(!isEditMode)
        setEditingProduct(product)
        handleEditOpenClose(openEdit)

        editFormik.setFieldValue("productName", product.name)
        editFormik.setFieldValue("productPrice", product.price)
        editFormik.setFieldValue("productDescription", product.description)

    }

    useEffect(() => {

        getAllProducts()

    }, [loadProduct])


    const {
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        // setFieldValue,
    } = useFormik({
        initialValues: {
            productName: "",
            productDescription: "",
            productPrice: "",
            productImg: "",
        },

        validationSchema:
            yup.object({
                productName: yup
                    .string('Enter your product name')
                    .required('product name is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                productPrice: yup
                    .number('Enter your product price')
                    .positive("enter positive product price")
                    .required('product Price is required'),

                productDescription: yup
                    .string('Enter your product Description')
                    .required('product Description is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(500, "please enter within 20 characters "),
            }),
        onSubmit: (values) => {
            console.log("values: ", values);

            axios.post(`${baseURI}/product`, {
                name: values.productName,
                price: values.productPrice,
                description: values.productDescription,
            })
                .then(response => {
                    console.log("response: ", response.data);
                    setLoadProduct(!loadProduct)
                    setOpen(!open);

                })
                .catch(err => {
                    console.log("error: ", err);
                })
        },
    });
    const editFormik = useFormik({
        initialValues: {
            productName: '',
            productPrice: '',
            productDescription: '',
        },
        validationSchema:
            yup.object({
                productName: yup
                    .string('Enter your product name')
                    .required('product name is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                productPrice: yup
                    .number('Enter your product price')
                    .positive("enter positive product price")
                    .required('product price is required'),

                productDescription: yup
                    .string('Enter your product Description')
                    .required('product Description is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(500, "please enter within 20 characters "),
            }),
        onSubmit: (values) => {
            console.log("values: ", values);

            axios.put(`${baseURI}/products/${editingProduct.id}`, {
                name: values.productName,
                price: values.productPrice,
                description: values.productDescription,
            })
                .then(response => {
                    console.log("response: ", response.data);
                    setLoadProduct(!loadProduct)
                    setOpenEdit(!openEdit)
                })

                .catch(err => {
                    console.log("error: ", err);
                })
        },

    });


    return (
        <div>
            <div className="navbar">
                {/* <h1>Hello 1</h1> */}
                <button className="unit" variant="contained" onClick={handleOpenClose}>
                    Add Product
                </button>
            </div>
            <div className='modal'>
            <Modal
                open={open}
                onClose={handleOpenClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="box">

                    <form onSubmit={handleSubmit} className="modalForm1">
                        <button className="unitX" variant="contained" onClick={handleOpenClose}>
                            X
                        </button>
                        <label htmlFor="productName" className="placeholder">
                            Product Name
                            <input
                                className="input"
                                type="text"
                                autoComplete="on"
                                id="productName"
                                placeholder="Your Product Name..."
                                name="productName"
                                value={values.productName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.productName && Boolean(errors.productName) ? (
                                <span className="errorSpan">{errors.productName}</span>
                            ) : null}
                        </label>

                        <label htmlFor="productPrice" className="placeholder">
                            Product Price
                            <input
                                className="input"
                                type="text"
                                autoComplete="on"
                                id="productPrice"
                                placeholder="Your Product Price..."
                                name="productPrice"
                                // value={values.productPrice}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {touched.productPrice && Boolean(errors.productPrice) ? (
                                <span className="errorSpan">{errors.productPrice}</span>
                            ) : null}
                        </label>

                        <label htmlFor="productDescription" className="placeholder">
                            Product Description
                            <input
                                className="input"
                                type="text"
                                autoComplete="on"
                                id="productDescription"
                                placeholder="Your Product Description..."
                                name="productDescription"
                                value={values.productDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {touched.productDescription &&
                                Boolean(errors.productDescription) ? (
                                <span className="errorSpan">{errors.productDescription}</span>
                            ) : null}
                        </label>



                        <div id="previewProductImg" alt=""></div>
                        <button type="submit" className="unit">
                            SUBMIT
                        </button>

                    </form>
                </Box>
            </Modal>
            </div>
           

            <div className='main'>
                {products.map((eachProduct, i) => (
                    <div className='product-container' key={eachProduct.id} >
                        <div className='product-details'>
                            <p className="producttitle">{eachProduct.name}</p>
                            <div className='price-container'>
                                <span>Rs.{eachProduct.price}</span>
                                <span>{eachProduct.description}</span>
                                {/* <span>{eachProduct.id}</span> */}
                                <div className="pBtn">
                                    <button className="unit" onClick={() => deleteProduct(eachProduct.id)}>Delete</button>
                                    <button className="unit" onClick={() => editMode(eachProduct)}>Edit</button>
                                    {/* <button className="unit" onClick={() => editMode(eachProduct.id)}>Update</button> */}
                                    {/* <button onClick={() => {
                                        editMode(eachProduct)
                                    }}>  edit</button> */}
                                </div>
                            </div>
                        </div>

                        {(isEditMode && editingProduct.id === eachProduct.id) ?
                            <div>
                                <Modal
                                    open={openEdit}
                                    onClose={handleEditOpenClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description">
                                    <Box sx={style} className='box'>
                                        <form onSubmit={editFormik.handleSubmit}>
                                            <label htmlFor="productName" className="placeholder">
                                                Edit Product Name
                                                <input
                                                    id="productName"
                                                    placeholder="Product Name"
                                                    value={editFormik.values.productName}
                                                    onChange={editFormik.handleChange}
                                                />
                                                {
                                                    (editFormik.touched.productName && Boolean(editFormik.errors.productName)) ?
                                                        <span className="errorSpan">{editFormik.errors.productName}</span>
                                                        :
                                                        null
                                                }
                                            </label>

                                            <label htmlFor="productPrice" className='plaseholder'>
                                                Edit Product Price

                                                <input
                                                    id="productPrice"
                                                    placeholder="Product Price"
                                                    value={editFormik.values.productPrice}
                                                    onChange={editFormik.handleChange}
                                                />
                                                {
                                                    (editFormik.touched.productPrice && Boolean(editFormik.errors.productPrice)) ?
                                                        <span className='errorSpan'>{editFormik.errors.productPrice}</span>
                                                        :
                                                        null
                                                }
                                            </label>

                                            <label htmlFor="productDescription" className='plaseholder'>
                                                Edit Product Description

                                                <input
                                                    id="productDescription"
                                                    placeholder="Product Description"
                                                    value={editFormik.values.productDescription}
                                                    onChange={editFormik.handleChange}
                                                />
                                                {
                                                    (editFormik.touched.productDescription && Boolean(editFormik.errors.productDescription)) ?
                                                        <span className='errorSpan'>{editFormik.errors.productDescription}</span>
                                                        :
                                                        null
                                                }
                                            </label>

                                            <br />
                                            <button type="submit" className='unit'> Submit </button>
                                        </form>
                                    </Box>
                                </Modal>

                            </div> : null}

                    </div>
                ))}
            </div>


        </div >





    );
}

export default Home;