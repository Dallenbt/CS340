import { useContext } from "react";
import { ToastActionsContext } from "../toaster/ToastContexts";

export const useMessageActions = () => useContext(ToastActionsContext);