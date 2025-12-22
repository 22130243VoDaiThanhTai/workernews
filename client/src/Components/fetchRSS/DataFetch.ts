import axios, { AxiosResponse } from 'axios';


const DataFetch = async <T, P = any>(url: string, payload: P): Promise<T> => {
  try {
    const res: AxiosResponse<T> = await axios.post<T>(url, payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export default DataFetch;