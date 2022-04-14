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
    // const [refresh, setRefresh] = useState(false);
    // const [dish, setDish] = useState([]);
    // const [image, setImage] = useState([])
    // const [url, setUrl] = useState("")
    // const [category, setCategory] = useState("")

    //const [aisleData, setAisleData] = useState([])
    const aisleData = [
        {
            aisleId: "G-0",
            category: "Kids",
            modelConfiguration: "Kids, Trousers, Male",
            booleanStartStop: true
        },
        {
            aisleId: "G-1",
            category: "Adult",
            modelConfiguration: "Adult, Short Sleeve Top, Female",
            booleanStartStop: true
        },
        {
            aisleId: "G-2",
            category: "Kids",
            modelConfiguration: "Kids, Skirts, Female",
            booleanStartStop: false
        },
        {
            aisleId: "G-3",
            category: "Adult",
            modelConfiguration: "Adult, Jeans, Male",
            booleanStartStop: true
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
        { title: "Category", field: "category" },
        { title: "Model Configuration", field: "modelConfiguration" },
        {
            title: "Start/Stop Service", field: "booleanStartStop", render: rowData => {
                console.log(rowData)
                if (rowData.booleanStartStop === true) {
                    return (
                        <Button variant="contained" color="success">
                            Start
                        </Button>

                    )
                }
                else {
                    return (
                        <Button variant="outlined" color="error">
                            Stop
                        </Button>
                    )
                }

            }
        },
    ]);

    // useEffect(() => {
    //     console.log("YESS")
    //     const restaurantId = JSON.parse(localStorage.getItem("restaurant"))[0]._id
    //     console.log(restaurantId)
    //     axios.get(`/api/getDishes/${restaurantId}`, {
    //     }).then(response => {
    //         if (response.status != 200) {
    //             M.toast({ html: response.statusText, classes: "#c62828 red darken-3" })
    //         }
    //         else {
    //             setDish(response.data)
    //         }
    //     })
    // }
    //     , [refresh, setRefresh]);

    // useEffect(() => {
    //     if (image != null && image.length != 0) {
    //         console.log("image", image)
    //         const data = new FormData()
    //         data.append("api_key", '757831828593633');
    //         data.append("file", image)
    //         data.append("upload_preset", "l3ihyhha")
    //         data.append("cloud_name", "du8oeufnp")
    //         fetch("https://api.cloudinary.com/v1_1/du8oeufnp/image/upload", {
    //             method: "post",
    //             body: data
    //         }).then(res => res.json())
    //             .then(res => {
    //                 console.log(JSON.stringify(res) + "Hiii")
    //                 setUrl(res.url)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //     }
    // }, [image]);



    return (
        <div>
            <MaterialTable
                icons={tableIcons}
                title="Aisle Recommendation strategy"
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
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            // setTimeout(() => {
                            //     console.log(image)
                            //     if (newData.images) {
                            //         const data = new FormData()
                            //         data.append("api_key", '757831828593633');
                            //         data.append("file", image)
                            //         data.append("upload_preset", "l3ihyhha")
                            //         data.append("cloud_name", "du8oeufnp")
                            //         fetch("https://api.cloudinary.com/v1_1/du8oeufnp/image/upload", {
                            //             method: "post",
                            //             body: data
                            //         }).then(res => res.json())
                            //             .then(res => {
                            //                 console.log(res + "Hiii")
                            //                 setUrl(res.url)
                            //                 setRefresh(!refresh)
                            //             })
                            //             .catch(err => {
                            //                 console.log(err)
                            //             })
                            //     }

                            //     console.log(newData)
                            //     setTimeout(() => {
                            //         const dishId = oldData._id
                            //         axios.post(`/api/updateDish/${dishId}`, { body: newData, url })
                            //             .then(response => {
                            //                 console.log(response)
                            //                 if (response.status != 200) {
                            //                     M.toast({ html: response.statusText, classes: "#c62828 red darken-3" })
                            //                 }
                            //                 else {
                            //                     M.toast({ html: "Added dish details successfully", classes: "#43a047 green darken-1" })
                            //                     setRefresh(!refresh)
                            //                 }
                            //             }).catch(err => {
                            //                 console.log(err)
                            //             })
                            //         resolve();
                            //     }, 100);
                            //     resolve();
                            // }, 100);
                        }),

                    // onRowAdd: newData =>
                    //     new Promise((resolve, reject) => {
                    //         setTimeout(() => {
                    //             if (newData.images) {
                    //                 const data = new FormData()
                    //                 data.append("api_key", '757831828593633');
                    //                 data.append("file", image)
                    //                 data.append("upload_preset", "l3ihyhha")
                    //                 data.append("cloud_name", "du8oeufnp")
                    //                 fetch("https://api.cloudinary.com/v1_1/du8oeufnp/image/upload", {
                    //                     method: "post",
                    //                     body: data
                    //                 }).then(res => res.json())
                    //                     .then(res => {
                    //                         console.log(res + "Hiii")
                    //                         setUrl(res.url)
                    //                     })

                    //                     .catch(err => {
                    //                         console.log(err)
                    //                     })
                    //             }
                    //             setTimeout(() => {
                    //                 const restaurantId = JSON.parse(localStorage.getItem("restaurant"))[0]._id
                    //                 console.log("Check this ya", restaurantId)
                    //                 axios.post(`/api/addDish/${restaurantId}`, { body: newData, url })
                    //                     .then(response => {
                    //                         console.log(response)
                    //                         if (response.status != 200) {
                    //                             M.toast({ html: response.statusText, classes: "#c62828 red darken-3" })
                    //                         }
                    //                         else {
                    //                             M.toast({ html: "Added dish details successfully", classes: "#43a047 green darken-1" })
                    //                             setRefresh(!refresh)
                    //                         }

                    //                     })
                    //                     .catch(() => alert("There was a error, Please try again"))
                    //             }, 100);
                    //             resolve();
                    //         }, 100);
                    //     }),

                    // onRowDelete: changes =>
                    //     new Promise((resolve, reject) => {
                    //         setTimeout(async () => {
                    //             /* setData([...data, newData]); */
                    //             setTimeout(() => {
                    //                 const dishId = changes._id
                    //                 console.log("Delete Ikkada")
                    //                 console.log(changes)
                    //                 axios.post(`/api/deleteDish/${dishId}`, {})
                    //                     .then((response) => {
                    //                         if (response.status != 200) {
                    //                             M.toast({ html: response.statusText, classes: "#c62828 red darken-3" })
                    //                         }
                    //                         else {
                    //                             M.toast({ html: "Deleted dish details successfully", classes: "#43a047 green darken-1" })
                    //                             setRefresh(!refresh)
                    //                         }
                    //                     })
                    //                     .catch(() => alert("There was a error, Please try again"))
                    //             }, 100);
                    //             // })
                    //             resolve();
                    //         }, 100);
                    //     }),
                }}
            />
            <hr style={{ marginTop: "30px" }} />
            <hr />

        </div>
    );
}
