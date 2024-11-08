import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import MainPage from '@pages/MainPage';
import TradeSettingsPage from '@pages/TradeSettingsPage';
import InvestmentStatusPage from '@pages/InvestmentStatusPage';
import AssetOverviewPage from '@pages/AssetOverviewPage';
import TradeDetailsPage from '@pages/TradeDetailsPage';
import PrivateRoute from "@router/PrivateRouter.jsx";
import PublicRouter from "@router/PublicRouter.jsx";

const routerInfo = [
    {
        path: 'login',
        element: <PublicRouter element={<LoginPage/>} /> ,
    },
    {
        path: 'signup',
        element: <PublicRouter element={<SignupPage/>} />,
    },
    {
        path: '/',
        element: <PrivateRoute element={<MainPage/>}/>,
    },
    {
        path: '/trade-settings',
        element: <PrivateRoute element={<TradeSettingsPage/>}/>,
    },
    {
        path: '/investment-status',
        element: <PrivateRoute element={<InvestmentStatusPage/>}/>,
    },
    {
        path: '/asset-overview',
        element: <PrivateRoute element={<AssetOverviewPage/>}/>,
    },
    {
        path: '/trade-details',
        element: <PrivateRoute element={<TradeDetailsPage/>}/>,
    },
];

export default routerInfo;