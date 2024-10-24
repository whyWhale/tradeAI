import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import MainPage from '@pages/MainPage';
import TradeSettingsPage from '@pages/TradeSettingsPage';
import InvestmentStatusPage from '@pages/InvestmentStatusPage';
import AssetOverviewPage from '@pages/AssetOverviewPage';
import TradeDetailsPage from '@pages/TradeDetailsPage';

const routerInfo = [
  {
    path: 'login',
    element: <LoginPage/>,
  },
  {
    path: 'signup',
    element: <SignupPage/>,
  },
  {
    path: '/',
    element: <MainPage/>,
  },
  {
    path: '/trade-settings',
    element: <TradeSettingsPage/>,
  },
  {
    path: '/investment-status',
    element: <InvestmentStatusPage/>,
  },
  {
    path: '/asset-overview',
    element: <AssetOverviewPage/>,
  },
  {
    path: '/trade-details',
    element: <TradeDetailsPage/>,
  },
];

export default routerInfo;