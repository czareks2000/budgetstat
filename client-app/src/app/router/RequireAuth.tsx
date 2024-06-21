import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

export default observer(function RequireAuth() {
    // const {userStore: {isLoggedIn}} = useStore();
    // const location = useLocation();

    // if (!isLoggedIn) {
    //     return <Navigate to="/" state={{from: location}} />
    // }

    return <Outlet/>
})