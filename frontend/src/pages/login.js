import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { Button } from 'react-bootstrap'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import axios from 'axios';
import M from 'materialize-css'
const Login = () => {
    const history = useHistory()
    return (
        <div className="container">
            <section className="page-section" id="about">
                <div className="container" style={{ justifyContent: 'center' }}>
                    <div className="row">
                        <div className="col-lg-12 text-center" >
                            <a href="/"> <h2 className="font-weight-normal " style={{ fontFamily: "serif" }}></h2></a>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <Formik
                            style={{ justifyContent: 'center' }}
                            initialValues={{
                                email: '',
                                password: ''
                            }}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values.email)) {
                                    M.toast({ html: "Email not valid", classes: "#c62828 red darken-3" })
                                    resetForm({})
                                    return
                                }
                                // axios.post('/api/login', { email: values.email, password: values.password })
                                //     .then(response => {
                                //         console.log(response)
                                //         if (response.data == "User Not Found") {
                                //             M.toast({ html: "Invalid username or password", classes: "#c62828 red darken-3" })
                                //             resetForm({})
                                //             return
                                //         }
                                //         else {
                                //             userDispatch(login(response.data))
                                //             localStorage.setItem("jwt", response.data.token)
                                //             if (response.data[0].location == null) {
                                //                 localStorage.setItem("customer", JSON.stringify(response.data))
                                //                 dispatch({ type: "CUSTOMER", payload: response.data })
                                //                 console.log("imp", state)
                                //                 M.toast({ html: "Login Successful-customer", classes: "#43a047 green darken-1" })
                                //                 resetForm({})
                                //                 history.push('/deliveryDashboard')
                                //             }
                                //             else if (response.data[0].location != null) {
                                //                 localStorage.setItem("restaurant", JSON.stringify(response.data))
                                //                 dispatch({ type: "RESTAURANT", payload: response.data })
                                //                 console.log("imp", state)
                                //                 M.toast({ html: "Login Successful-restaurant", classes: "#43a047 green darken-1" })
                                //                 resetForm({})
                                //                 history.push('/restaurantDashboard')
                                //             }
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
                                    <h4 className="font-weight-normal" style={{ fontFamily: 'UberMoveText-Medium,Helvetica,sans-serif' }}> Welcome Admin!</h4>
                                    <br />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label style={{ width: "100%" }}>Enter your email id<input required style={{ width: "100%", borderRadius: 0 }} className="form-control" id="email" type="text" onBlur={handleBlur} onChange={handleChange} value={values.email} /></label>
                                                <p className="help-block text-danger"></p>
                                            </div>
                                            <div className="form-group" >
                                                <label style={{ width: "100%" }}>Password <input required type="password" style={{ width: "100%", borderRadius: 0 }} className="form-control" id="password" onBlur={handleBlur} onChange={handleChange} value={values.password} /></label>
                                                <p className="help-block text-danger"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button disabled={isSubmitting} type="submit" style={{ width: "100%", backgroundColor: 'black', borderRadius: 0 }} variant="dark" size="lg">
                                        Login
                                    </Button>
                                    <br />
                                    <br />
                                    <div style={{ textAlign: 'center' }}>
                                        New User?
                                        {' '}
                                        <Link to="/signup" style={{ color: 'green' }}>Create an account</Link>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login