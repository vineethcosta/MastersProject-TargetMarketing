import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { Button } from 'react-bootstrap'
import axios from 'axios';
import M from 'materialize-css'


const Register = () => {
    const history = useHistory()
    return (
        <div className="container">
            <section className="page-section" id="about">
                <div className="container" style={{ justifyContent: 'center' }}>
                    <div className="row">
                        <div className="col-lg-12 text-center" >
                            <a href="/" ><h2 className="font-weight-normal " style={{ fontFamily: "serif" }}></h2></a>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <Formik
                            style={{ width: '40%' }}
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                storeName: 'Target',
                            }}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                console.log(values)
                                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values.email)) {
                                    M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
                                    resetForm({})
                                    history.push('/signup')
                                    return
                                }
                                // axios.post('/api/signup', { name: values.name, email: values.email, password: bcrypt.hashSync(values.password, 12) })
                                //     .then((response) => {
                                //         console.log(response)
                                //         if (response == "Customer Already registered") {
                                //             M.toast({ html: "Customer Already registered", classes: "#c62828 red darken-3" })
                                //         }
                                //         else {
                                //             userDispatch(login(response))
                                //             M.toast({ html: "Customer Signup Success", classes: "#43a047 green darken-1" })
                                //             resetForm({})
                                //             history.push('/login')
                                //         }
                                //     }).catch(err => {
                                //         M.toast({ html: err, classes: "#c62828 red darken-3" })
                                //         resetForm({})
                                //     })
                            }}>

                            {({
                                errors,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                isSubmitting,
                                touched,
                                values
                            }) => (
                                <form id="contactForm" style={{ width: '40%' }} name="sentMessage" onSubmit={handleSubmit}>
                                    <h4 className="font-weight-normal" style={{ fontFamily: 'UberMoveText-Medium,Helvetica,sans-serif' }}> Register</h4>
                                    <br />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label style={{ width: "100%" }}>Enter your name<input required style={{ width: "100%", borderRadius: 0 }} className="form-control" id="name" type="text" onBlur={handleBlur} onChange={handleChange} value={values.name} /></label>
                                                <p className="help-block text-danger"></p>
                                            </div>
                                            <div className="form-group">
                                                <label style={{ width: "100%" }}>Enter your email id<input required style={{ width: "100%", borderRadius: 0 }} className="form-control" id="email" type="text" onBlur={handleBlur} onChange={handleChange} value={values.email} /></label>
                                                <p className="help-block text-danger"></p>
                                            </div>
                                            <div className="form-group" >
                                                <label style={{ width: "100%" }}>Password <input required type="password" style={{ width: "100%", borderRadius: 0 }} className="form-control" id="password" onBlur={handleBlur} onChange={handleChange} value={values.password} /></label>
                                                <p className="help-block text-danger"></p>
                                            </div>
                                            <div className="form-group" >
                                                <label style={{ width: "100%" }}>Store name <input required type="text" style={{ width: "100%", borderRadius: 0 }} className="form-control" id="storeName" onBlur={handleBlur} onChange={handleChange} value={values.storeName} /></label>
                                                <p className="help-block text-danger"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button disabled={isSubmitting} type="submit" style={{ width: "100%", backgroundColor: 'black', borderRadius: 0 }} variant="dark" size="lg">
                                        Signup
                                    </Button>
                                    <br />
                                    <br />
                                    <div style={{ textAlign: 'center' }}>
                                        Already use this website?
                                        {' '}
                                        <Link to="/login" style={{ color: 'green' }}>Login</Link>
                                    </div>
                                </form>
                            )}
                        </Formik>

                    </div>
                </div>
            </section >
        </div >
    );
}


export default Register