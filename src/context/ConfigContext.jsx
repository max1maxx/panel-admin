import { createContext, useContext, useState } from "react";
import { getDevicesRequest, changeWifiConfig, changeLanConfig, getConfigs, changeMapPortsConfig, getDevicesRequestById, resetDevice } from "../api/config";

const ConfigContext = createContext();

export const useConfig = () => {
    const context = useContext(ConfigContext);

    if (!context) {
        throw new Error("useContext must be used with a config context");
    }
    return context;
}

export function ConfigProvider({ children }) {

    const [configs, setConfig] = useState([]);
    const [dataConfig, setDataConfig] = useState([]);
    const [dataById, setDataById] = useState([]);

    const getDevices = async () => {
        try {
            const res = await getDevicesRequest();
            // console.log(res.data); // Depuración para ver los datos recibidos
            setConfig(res.data); // Asegúrate de devolver los datos
        } catch (error) {
            console.error('Error al obtener los dispositivos:', error);
            return []; // Devuelve un arreglo vacío en caso de error
        }
    }

    const listarPorId = async (data) => {
        try {
            const res = await getDevicesRequestById(data);
            setDataById(res.data);
            // console.log(res.data);
        } catch (error) {
            console.error('Error al obtener el dispositivo:', error.message);
        }
    }

    const cambiarNombreClaveWifi = async (data) => {
        try {
            const res = await changeWifiConfig(data);
            // console.log(res);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    }

    const cambiarLan = async (data) => {
        try {
            const res = await changeLanConfig(data);
            // console.log(res);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    }

    const cambiarMapeoPuertos = async (data) => {
        try {
            const res = await changeMapPortsConfig(data);
            // console.log(res);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    }

    const obtenerDatosConfigurados = async (data) => {
        try {
            const res = await getConfigs(data);
            setDataConfig(res.data)
            // console.log(res.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    const resetear = async (data) => {
        try {
            const res = await resetDevice(data);
            // console.log(res);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    }

    return (
        <ConfigContext.Provider value={{ configs, getDevices, cambiarNombreClaveWifi, cambiarLan, obtenerDatosConfigurados, dataConfig, cambiarMapeoPuertos, listarPorId, dataById, resetear }}>{children}</ConfigContext.Provider>
    )
}