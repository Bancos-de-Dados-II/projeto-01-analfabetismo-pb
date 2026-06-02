import api from "./api";

export async function buscarMunicipios() {
  const response = await api.get("/dados");
  return response.data;
}