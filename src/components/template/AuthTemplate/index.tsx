import {Outlet} from "react-router-dom";

import Logo from "@/logo.svg";
import {useAppContext} from "@/context/globalContext";

export const AuthTemplate = () => {
  const [ state ] = useAppContext();
  return (
    <>
      <div className="flex items-center content-center pl-[20px] pr-[20px] h-[50px] bg-white gap-3">
        <img className="max-h-12" alt="error" src={Logo} />
        <div className="flex order-2 ml-auto items-center">
          {state.address} - ({state.balance} ETH)
        </div>
      </div>
      <Outlet />
    </>
  )
}