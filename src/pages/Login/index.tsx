import {useAppContext} from "../../context/globalContext";
import {Navigate} from "react-router-dom";
import {requestAccounts} from "../../contract/lottery";

export const Login = () => {
  const [state, dispatch] = useAppContext();

  if (state.hasEntered) {
    return <Navigate to="/lottery"/>
  }

  const authenticateWithMetamask = async () => {
    // This will prompt the user for wallet connection
    const accounts = await requestAccounts()
    // Then we gather information to add to our global state
    const address = accounts[0]
    dispatch({
      hasEntered: true,
      address
    });
  };
  return (
    <div className="h-[100vh] flex justify-center items-center bg-gray-400 shadow">
      <button className="rounded-xl h-[70px] min-w-[200px] p-3 bg-orange-200" onClick={authenticateWithMetamask}>Login</button>
    </div>
  )
}