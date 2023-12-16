import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL as string;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const createRoom = () => {
  return instance.post("/room").then(({ data }) => data?.id as string);
};

const getRoom = (code: string) => {
  return instance.get(`/room/${code}`).then(({ data }) => data?.id as string);
};

const api = Object.freeze({
  createRoom,
  getRoom,
});

export default api;
