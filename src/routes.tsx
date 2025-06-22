import { createBrowserRouter } from "react-router-dom";

import Home from "./Pages/Home";
import Detail from "./Pages/Detail";
import Error from "./Pages/Error";
import Layout from "./components/Layout";
// import { Children } from "react";


    const router = createBrowserRouter([
        {
element:<Layout/>,
            children:[
                {
                    path:'/',
                    element:<Home/>
                },
                {
                    path:'/detail/:cripto',
                    element:<Detail/>
                },


                {
                    path:'*',
                    element:<Error/>
                }
            ]
        }
    ])

    export {router}  