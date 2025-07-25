import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn/SignIn';
import User from './Components/User/User';
import MainItems from './Components/MainItems/MainItems';
import SignUp from './Components/SignUp/SignUp';
import RecentContest from './Components/RecentContest/RecentContest';
import AddStudent from './Components/AddStudent/AddStudent';
import ChangeAdmin from './Components/ChangeAdmin/ChangeAdmin';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/user" element={<User />} />
        <Route path='/' element={<MainItems/>} />
        <Route path='/signUp' element={<SignUp/>} />
        <Route path='/stats' element={<RecentContest/>}/>
        <Route path='/addStudent' element={<AddStudent/>}/>
        <Route path='/changeAdmin' element={<ChangeAdmin/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
