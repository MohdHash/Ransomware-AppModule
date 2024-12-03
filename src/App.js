import { createBrowserRouter , Outlet , RouterProvider } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RegisterComplaint from './components/RegisterComplain';
import ViewReports from './components/ViewReports';
import CaseDetails from './components/CaseDetails';
import { checkAuthorization , logout } from './authUtils';
import TargetCallbackHandler from './TargetCallbackHandler';
import BackToTopButton from './components/BackToTopButton';
import { useEffect } from 'react';
import Footer from './components/Footer';
import MeetingApp from './components/JoinMeet';
import ScheduledMeeting1 from './components/ScheduledMeeting1';

const AppLayout = ()=>{
  const location = useLocation();
  const skipHeaderAndEffect = location.pathname === '/';
  const jwtToken = sessionStorage.getItem('jwt');
  useEffect(()=>{
    if(skipHeaderAndEffect) return;

    const tokenUpdateInterval = setInterval(()=>{
      
      if(jwtToken){
        sessionStorage.setItem('jwt', jwtToken);
      }
    },1000);

    const checkAuthInterval = setInterval(()=>{
      if(!checkAuthorization()){
        console.warn("Token Check Failed - redirecting to login");
        logout();
      }
    },500);

    return ()=>{
      clearInterval(tokenUpdateInterval);
      clearInterval(checkAuthInterval);
    };

  },[location.pathname , jwtToken])

  return(
    <div className='app'>
      {/* Global ToastContainer with default settings */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {!skipHeaderAndEffect && <Header />}
      <Outlet />
      <BackToTopButton />
    </div>
  );
};


const AppRoutes = ()=>{
  const location = useLocation();
  const jwtToken = sessionStorage.getItem('jwt');
 //this function checks if the token is present or not for every 0.5 seconds
  useEffect(() => {
    // Skip applying the effect for the TargetCallbackHandler route
    // as in the target callback page  the token will not be present in the session storage
    if (location.pathname === '/') return;
 
    const tokenUpdateInterval = setInterval(() => {
      if (jwtToken) {
        sessionStorage.setItem('jwt', jwtToken);
      }
    }, 1000);
 
    const authCheckInterval = setInterval(() => {
      if (!checkAuthorization()) {
        console.warn('Token check failed - redirecting to login');
        logout();
      }
    }, 500); // Every 10 seconds
 //clear the interval to improve the performace of the application
    return () => {
      clearInterval(tokenUpdateInterval);
      clearInterval(authCheckInterval);
    };
  }, [location.pathname, jwtToken]);

  return(
    <Routes>
      <Route path='/' element={<TargetCallbackHandler />} />
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/register-complaint' element={<RegisterComplaint />}/>
      <Route path='/view-reports' element={<ViewReports />}/>
      <Route path='/case-details/:id' element={<CaseDetails />}/>
      <Route path="/meetings/:caseId" element={<ScheduledMeeting1 />} />
      <Route path="/joinmeeting/:meetingId" element={<MeetingApp />} />
    </Routes>
  )

}

const appRouter = createBrowserRouter([
  {
    path:'/',
    element: <AppLayout />,
    children:[
      {
        path:'/dashboard',
        element:<Dashboard />
      },
      {
        path:'/register-complaint',
        element: <RegisterComplaint />
      },
      {
        path:'/view-reports',
        element: <ViewReports />
      },
      {
        path:'/case-details/:id',
        element: <CaseDetails />
      },
      {
        path:'/',
        element:<TargetCallbackHandler />
      }
    ],
  },
]);

function App() {
  return(
    <RouterProvider router={appRouter}/>
  )
}

const App1 = ()=>{
  return(
   
      <Router>
        <Header />
        <AppRoutes />
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BackToTopButton />
      <Footer />
      </Router>
    
  )
}
export default App1;
