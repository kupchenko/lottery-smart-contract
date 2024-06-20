import {useAppContext} from "@/context/globalContext";
import {Navigate} from "react-router-dom";
import {getAddressBalance, requestAccounts} from "@/contract/lottery";
import {Button} from "@/components/shadcn/ui/button";

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
    const balance = await getAddressBalance(address);
    dispatch({
      hasEntered: true,
      address,
      balance
    });
  };
  return (
    <div className="h-[100vh] flex justify-center items-center bg-gray-400 shadow">
      <Button className="h-[100px] w-[300px] text-[50px]" onClick={authenticateWithMetamask}>Join</Button>
    </div>
  )
}