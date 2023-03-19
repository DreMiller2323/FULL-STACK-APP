import React, {useState, useContext} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import AuthContext from '../../globalAuth/appAuth/AuthProvider';
import { Form, Input, Button, Typography } from "antd";
const Login = () => {
  const {setAuth}=useContext(AuthContext)
  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const [user, setUser]=useState({
    email:"",
    password:""
  });
  const navigate=useNavigate();
const [loggedIn, setLoggedIn]=useState(false)
 const [err, errMsg]=useState("")
const onSubmit= async (e)=>{

  e.preventDefault()
  try{
  const userData = { email: user.email, password: user.password };
 const loggedIn= axios.post("http://localhost:3001/users/login", userData).then((response) => {
  setLoggedIn(true);
  setAuth({user})
  console.log(" token is true ")
      console.log(response.status, response.data);
    });
    if(!loggedIn){
  setLoggedIn(false);
  console.log(" user not logged in ")
    }
  }catch(error){
    if(error===401){
      errMsg("You are not Authorized")
    }
 console.log(error)
  }
}
 return (
<>
{ loggedIn ?
(
<div class="mainPage">
<h1>Hoop!</h1>
<Link to="/BuildRoster">BuildRoster</Link>
<br/>
<Link to="/Chat">Chat</Link>
<br/>

<Link to="/Ball">Find Court!</Link>
<br/>
<Link to="new-path"  />
<br />

</div >


):(
  
    <div>
      <Title // Form's Title
        level={3}
        style={{
          marginBottom: 0,
          paddingTop: 20,
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        Login
      </Title>
      <Text // Form's Description
        type="secondary"
        style={{
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
   Hoop Star    
 </Text>
      <Form // Ant Design's Form Component
        name="login form"
        layout="vertical"
        form={form}
        wrapperCol={{
          span: 6,
        }}
        style={{
          marginTop: 20,
          paddingBottom: 10,
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <Form.Item // Form Item (First Name)
          label="Email"
          name="email"
          value="Email"
          onChange={(e)=> setUser({...user, email: e.target.value})}
          required
          tooltip="This is a required field"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
          ]}
        >
          <Input  placeholder="Email" />
        </Form.Item>
        <Form.Item // Form Item (Password)
          label="Password"
          name="password"
          onChange={(e)=> setUser({...user, password: e.target.value})}

          required
          tooltip="This is a required field"
          rules={[
            {
              required: true,
              message: "Please enter your Password!",
            },
          ]}
        >
         
          <Input
          type="password"
            placeholder="Password"
            // autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item // Form Item (Submit Button)
        >
          <Button  onClick={onSubmit} type="primary" htmlType="submit">Submit</Button>

        </Form.Item>

      </Form>

    </div>
)}
</>
  )
  
};

export default Login;