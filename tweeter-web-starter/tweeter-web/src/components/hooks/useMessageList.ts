import { useContext } from "react";
import { ToastListContext } from "../toaster/ToastContexts";

export const useMessageList = () => useContext(ToastListContext);