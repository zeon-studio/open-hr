import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;
const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Axios = axios.create({
  baseURL: BackendURL,
  headers: {
    authorization_token: `Bearer ${TOKEN}`,
  },
});

export default Axios;
