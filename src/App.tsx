import './App.css'
import Toolbar from "./components/Toolbar/Toolbar.tsx";
import {Route, Routes} from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.tsx";
import Home from "./components/Home/Home.tsx";
import CategoriesPage from "./components/CategoriesPage/CategoriesPage.tsx";

const App = () => (
    <>
       <header><Toolbar/></header>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/*' element={<NotFoundPage />} />
            <Route path='/categories' element={<CategoriesPage />} />
        </Routes>
    </>
);

export default App
