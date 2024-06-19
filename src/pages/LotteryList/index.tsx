import {useNavigate} from "react-router-dom";
import {Button} from "@/components/shadcn/ui/button";

export const LotteryList = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate('/lottery/0x5e4FE4c3b141d66B9f40f96c3B65D5f6C7da9150')}
        >
        Navigate
      </Button>
    </>
  )
}