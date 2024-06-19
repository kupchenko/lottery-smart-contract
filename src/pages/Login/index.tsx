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
    <>
      <button onClick={authenticateWithMetamask}>Login</button>
    </>
  )
}