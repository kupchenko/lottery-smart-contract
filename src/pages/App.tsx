import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {SecuredHOC} from "@/hoc/SecuredHOC";
import {Lottery} from "./Lottery";
import {Login} from "./Login";
import '@/App.css';
import {LotteryList} from "@/pages/LotteryList";
import {AuthTemplate} from "@/components/template/AuthTemplate";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SecuredHOC/>}>
          <Route element={<AuthTemplate/>}>
            <Route path="/lottery/:address" element={<Lottery/>}/>
            <Route path="/lottery" element={<LotteryList/>}/>
          </Route>
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route
          path="*"
          element={<Navigate to="/lottery" replace={true}/>}
        />
      </Routes>
    </BrowserRouter>
  )
}