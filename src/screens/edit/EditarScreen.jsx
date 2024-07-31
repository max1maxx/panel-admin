import EditarWifi from "../../components/conf_ont/editar_wifi/EditarWifi";
import { useParams, Link } from "react-router-dom";
import { useConfig } from "../../context/ConfigContext";
import { useEffect, useState } from "react";
import EditarLan from "../../components/conf_ont/editar_lan/EditarLan";
import EditarMapeoPuertos from "../../components/conf_ont/editar_mapeo_puertos/EditarMapeoPuertos";
import { IoMdArrowRoundBack } from "react-icons/io";


const EditarScreen = () => {
    const { id } = useParams();
    const { listarPorId, dataById } = useConfig();

    useEffect(() => {
        listarPorId({ id });
    }, [id]);

    const ontInfo = dataById && dataById.length > 0 ? dataById[0] : null;

    return (
        <div>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        {ontInfo ? (
                            <div className="ont-info">
                                <p><strong>Fabricante:</strong> {ontInfo._Manufacturer}</p>
                                <p><strong>WAN IP:</strong> {ontInfo._WANDevice}</p>
                                <p><strong>Clase de Producto:</strong> {ontInfo._ProductClass}</p>
                                <p><strong>Número de Serie:</strong> {ontInfo._SerialNumber}</p>
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
                                <EditarWifi deviceId={id} />
                            </div>
                            <div className="col-12 p-2">
                                <EditarLan deviceId={id} />
                            </div>
                            <div className="col-12 p-2">
                                <EditarMapeoPuertos deviceId={id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditarScreen;
