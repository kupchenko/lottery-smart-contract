import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SecuredHOC} from "../hoc/SecuredHOC";
import Index from "./Lottery";
import {Login} from "./Login";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SecuredHOC/>}>
          <Route path="/lottery" element={<Index/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}