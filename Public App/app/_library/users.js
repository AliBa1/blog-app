import axios from "axios";

export const loginUser = async (e, username, password, setError, setLoginSuccess) => {
  e.preventDefault();
  try {
    // const login = await axios.post('http://localhost:8000/users/login', {
    const login = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      username: username,
      password: password
    });
    // console.log(login);
    if (login.status === 200) {
      setLoginSuccess(true);
      localStorage.setItem("token", login.data.token);
      localStorage.setItem("userId", login.data.userId);
    }
  } catch (error) {
    console.error(error.response?.data.error || error.response?.data.errors[0].msg);
    setError(error.response?.data.error || error.response?.data.errors[0].msg);
  }
}

export const createUser = async (e, firstName, lastName, username, password, confirmPassword, setError, setRegisterSuccess) => {
  e.preventDefault();
  try {
    // const register = await axios.post('http://localhost:8000/users/register', {
    const register = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      confirmPassword: confirmPassword
    });
    if (register.status === 200 || register.status === 201) {
      setRegisterSuccess(true);
      // const login = await axios.post('http://localhost:8000/users/login', {
      const login = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        username: username,
        password: password
      });
      localStorage.setItem("token", register.data.token);
      localStorage.setItem("userId", register.data.userId);
    }
  } catch (error) {
    console.error(error.response?.data.error || error.response?.data.errors[0].msg);
    setError(error.response?.data.error || error.response?.data.errors[0].msg);
  }
}

export const logoutUser = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  } catch (error) {
    console.error(error.response?.data.error || error.response?.data.errors[0].msg);
  }
}

export const authenticate = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // const response = await axios.get('http://localhost:8000/users/authenticate', {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/authenticate`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // console.log(response.data);
    return true;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data.error || error.message);
    return false;
  }
}

export const getUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    // const user = await axios.get(`http://localhost:8000/users/${userId}/posts`, {
    const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(user.data);
    return user.data;
  } catch (error) {
    console.error(error.response?.data.error);
  }
}