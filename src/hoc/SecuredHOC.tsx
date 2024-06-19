import {useAppContext} from "../context/globalContext";
import {Navigate, Outlet} from "react-router-dom";

export function SecuredHOC() {
  const [state] = useAppContext();
  if (!state.hasEntered) {
    return <Navigate to="/login"/>
  }

  return <Outlet/>;
}