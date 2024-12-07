import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import img from '../../../src/image/cpc-logo.png';
import "react-toastify/dist/ReactToastify.css";
import './login.css';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';
import { sendData } from '../../encrypt';

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const result = await sendData(email, password);
      if (result.status === 'success') {
        setMessage("Login successful!");
        setUser({
          userId: result.userid,
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          mobile: result.mobile,
          branch: result.branch,
          location: result.location,
          photo: result.photo,
          accessId: result.accessid,
          add: result.addapprove,
          transfer: result.transfer,
          scrap: result.scrap,
          usertype: result.name,
          dashboard: result.dashboard,
          alc: result.alc,
          report: result.report,
          setup: result.setup,
          inventory: result.inventory,
          assetadd: result.assetadd,
          area: result.area,
        });
        onLogin();
        navigate("/dashboard");
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <AnimatedBackground>
        <div id="app">
          <div className="container-fluid font-sui">
            <div className="row justify-content-center">
              <div className="col-lg-12 text-center">
                <img src={img} alt="sampat-logo" width="20%" height="20%" className="mx-auto d-block img-fluid mt-2" />
              </div>
              <div className="col-lg-12 whole-login mt-4">
                <div className='form-background'>
                  <label htmlFor="username" className="text-flo text-sm font-medium">Username</label>
                  <br />
                  <div className="input-container">
                    <FontAwesomeIcon icon={faUser} className="input-icon  text-flo"  />
                    <input
                      type="email"
                      placeholder="Your Email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-login mt-2 border-none placeholder:text-prime text-flo font-medium placeholder:text-xs"
                      autoComplete="off"
                    />
                  </div>
                  <br />
                  <label htmlFor="password" className="text-flo text-sm font-medium">Password</label>
                  <br />
                  <div className="input-container">
                    <FontAwesomeIcon icon={faLock} className="input-icon text-flo" />
                    <input
                      type="password"
                      placeholder="Your Password"
                      id="password"
                      name="password"
                      className="input-login mt-2 border-none placeholder:text-prime  text-flo font-medium  placeholder:text-xs"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <input
  type="checkbox"
  name="remember"
  id="remember"
  defaultChecked={true}
  className='mt-4 mb-2 ml-2 text-flo text-sm'
/>
<label htmlFor="remember" className="text-flo text-xs font-medium">
  <span>&nbsp;&nbsp;Remember Me</span>
</label> <br /><br />
                  <div className='text-center'>
                    <input type="submit" onClick={handleLogin} className="submit text-sm border-login text-box bg-flo" />
                  </div> <br />
                  {message && <p className="text-red-500 mt-4 text-center">{message}</p>}
                </div>
              </div>
            </div>
            <footer className='footer text-flo text-sm font-normal'>
              <h6>&#169;2024 Amvion Labs Private Limited . All Rights Reserved</h6>
            </footer>
          </div>
        </div>
      </AnimatedBackground>
    </>
  );
};

export default Login;