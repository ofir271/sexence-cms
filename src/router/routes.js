import AppHeader from "@/views/layout/AppHeader";
import AppSidebar from "@/views/layout/AppSidebar";
import AppFooter from "@/views/layout/AppFooter";
import Home from "@/views/Home";
import Login from "@/views/Login";
import DataTable from "@/views/layout/DataTable";
import DataDetails from "@/views/layout/DataDetails";

export const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/login",
        components: {
            default: Login,
            header: AppHeader,
            footer: AppFooter
        },
        name: "Login"
    },
    {
        path: "/home",
        components: {
            default: Home,
            header: AppHeader,
            sidebar: AppSidebar,
            dataTable: DataTable,
            dataDetails: DataDetails,
            footer: AppFooter,
        },
        name: "Home"
    },    
];  