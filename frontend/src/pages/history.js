import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from 'axios';
import M from 'materialize-css';
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Edit from '@material-ui/icons/Edit';
import AddBox from '@material-ui/icons/AddBox';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Clear from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Check from '@material-ui/icons/Check';
import Input from '@material-ui/core/Input';
import Select from 'react-select';
import { Button } from "@mui/material";

import 'antd/dist/antd.css';

import Modal from "@material-ui/core/Modal";
import { makeStyles } from '@material-ui/core/styles';

import {
    InputLabel,
    Grid,
    MenuItem
} from '@material-ui/core';

const tableIcons =
{
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
}
export default function Dashboard() {
    const [pastOrders, setPastOrders] = useState([])
    //const [orderDetails, setOrderDetails] = useState(null)
    const [open, setOpen] = useState(false);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(-1);
    const [refresh, setRefresh] = useState(true);
    const [specialInstructions, setSpecialInstructions] = useState(null);
    const [modalStyle] = useState(getModalStyle);
    const [status, setStatus] = useState("Recommended Product History")
    const orderDetails = [1, 2, 3, 4, 5]
    const slice = [1, 2, 3, 4, 5]
    const dict = {
        0: "Kids, Trousers, Male",
        1: "Adult, Short Sleeve Top, Female",
        2: "Kids, Skirts, Female",
        3: "Adult, Jeans, Male",
    }
    const aisleData = [
        {
            aisleId: "G-0",
            frowns: 2,
            category: "Kids",
            modelConfiguration: "Kids, Trousers, Male",

        },
        {
            aisleId: "G-1",
            frowns: 4,
            category: "Adult",
            modelConfiguration: "Adult, Short Sleeve Top, Female",

        },
        {
            aisleId: "G-2",
            frowns: 0,
            category: "Kids",
            modelConfiguration: "Kids, Skirts, Female",

        },
        {
            aisleId: "G-3",
            frowns: 1,
            category: "Adult",
            modelConfiguration: "Adult, Jeans, Male",

        },

    ]
    const [columns, setColumns] = useState([
        {
            title: "Serial Number",
            field: "_id",
            render: (rowData) => <div>{rowData.tableData.id + 1}</div>,
            editable: false
        },
        { title: "Aisle ID", field: "aisleId" },
        { title: "Model Configuration", field: "modelConfiguration" },
        { title: "Number of Frowns before Smile", field: "frowns" },
        {
            title: "Click here to View", field: "clickHere", render: rowData => {

                return (
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        View Recommended Products
                    </Button>

                )

            }
        },
    ]);




    const handleChange = (event) => {
        setStatus(event.target.value);
        setCurrentPage(1)

    };
    const handleSizeChange = (event) => {
        setPerPage(event.target.value);
        setCurrentPage(1)
    };

    function getModalStyle() {
        return {
            justifyContent: 'center',
            padding: 50
        };
    }


    const handleOpen = (index) => {

        setOpen(true)
    };



    const useStyles = makeStyles(theme => ({
        paper: {
            position: "relative",
            width: 600,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            outline: "none",
            top: '-25%',
            right: 'auto',
            bottom: 'auto',
            overlfow: 'scroll', // <-- This tells the modal to scrol
            maxHeight: 'calc(100vh)',
            overflowY: 'auto'
        }
    }));
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
        setTotal(0)
    };




    return (
        <div>
            {
                <Modal
                    backdropOpacity={0.3}
                    style={{ marginTop: '20%', backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    open={open}
                    onClose={handleClose}
                    scrollable={true}
                >
                    <div style={modalStyle} className={classes.paper}>
                        <h4 style={{ textAlign: 'center' }}>Products recommended successfuly with a smile</h4>
                        <hr />
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                item
                                lg={10}
                                md={10}
                                xs={12}
                            > <h5>Aisle Number</h5>
                            </Grid>
                            <Grid
                                item
                                lg={2}
                                md={2}
                                xs={12}
                            > <h5>G-0</h5></Grid>

                            <Grid
                                item
                                lg={12}
                                md={12}
                                xs={12}
                            ></Grid>

                        </Grid>
                        {
                            orderDetails.map((item, index) => {
                                if (index == 0) {
                                    return (
                                        <div style={{ padding: '20px', backgroundColor: '#f6f6f6' }}>
                                            <table >
                                                <tr>

                                                    <td><img style={{ width: 300, height: 200 }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKob3HORGUwsJ30Ov9w1f3JYSa2mzfOtjknA&usqp=CAU"></img></td>
                                                </tr>
                                            </table>

                                        </div>
                                    )
                                }
                                else if (index == 1) {
                                    return (
                                        <div style={{ padding: '20px', backgroundColor: '#f6f6f6' }}>
                                            <table >
                                                <tr>

                                                    <td><img style={{ width: 300, height: 200 }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-RUWgCzHr1IFRZ65WDfaixPKfxWMVynIu4g&usqp=CAU"></img></td>


                                                </tr>
                                            </table>

                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div style={{ padding: '20px', backgroundColor: '#f6f6f6' }}>
                                            <table >
                                                <tr>

                                                    <td><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZQ2WspvUZgLuok-5Yux-YtEzaI3pM2OgufA&usqp=CAU"></img></td>


                                                </tr>
                                            </table>

                                        </div>
                                    )
                                }

                            })

                        }

                    </div>
                </Modal>
            }
            <MaterialTable
                icons={tableIcons}
                title="PRODUCT RECOMMENDATION HISTORY"
                columns={columns}
                data={aisleData}
                style={{ padding: 10, width: '100%' }}
                localization={{
                    header: {
                        actions: ''
                    }
                }
                }
                options={{
                    sorting: true,
                    pageSize: 5,
                    paginationType: "stepped",
                }}

            />
            <hr style={{ marginTop: "30px" }} />
            <hr />

        </div>
    );
}







