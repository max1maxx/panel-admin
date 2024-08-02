import EditarWifi from "../../components/conf_ont/editar_wifi/EditarWifi";
import { useParams, Link } from "react-router-dom";
import { useConfig } from "../../context/ConfigContext";
import { useEffect, useState } from "react";
import EditarLan from "../../components/conf_ont/editar_lan/EditarLan";
import EditarMapeoPuertos from "../../components/conf_ont/editar_mapeo_puertos/EditarMapeoPuertos";
import { IoMdArrowRoundBack } from "react-icons/io";


const EditarScreen = () => {
    const { id } = useParams();
    const { obtenerDatosConfigurados, dataConfig } = useConfig();
   
    useEffect(() => {
        obtenerDatosConfigurados({ id });
    }, [id]);
    
    return (
        <div>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        {dataConfig ? (
                            <div className="ont-info">
                                <p><strong>Fabricante:</strong> {dataConfig.marca}</p>
                                <p><strong>WAN IP:</strong> {dataConfig.ipWAN}</p>
                                <p><strong>Clase de Producto:</strong> {dataConfig.modelo}</p>
                                <p><strong>Número de Serie:</strong> {dataConfig.puertoPON}</p>
                                <Link to="/dispositivos" className="btn btn-primary mt-3">
                                    <IoMdArrowRoundBack size={20} />
                                    Volver a dispositivos
                                </Link>
                            </div>
                        ) : (
                            <p>Cargando información del ONT...</p>
                        )}
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 p-2">
                                <EditarWifi dato={dataConfig} deviceId={id} />
                            </div>
                            <div className="col-12 p-2">
                                <EditarLan dato={dataConfig} />
                            </div>
                            <div className="col-12 p-2">
                                <EditarMapeoPuertos dato={dataConfig} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditarScreen;
