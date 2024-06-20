import EditarWifi from "../../components/conf_ont/editar_wifi/EditarWifi";
import { useParams } from "react-router-dom";
import { useConfig } from "../../context/ConfigContext";
import { useEffect, useState } from "react";
import EditarLan from "../../components/conf_ont/editar_lan/EditarLan";

const EditarScreen = () => {
    const { id } = useParams();
    useEffect(() => {
        // Aquí podrías cargar los datos actuales del dispositivo si es necesario
    }, [id]);
    return (
        <div>
            <EditarWifi deviceId={id} />
            <br />
            <EditarLan deviceId={id} />
        </div>
    );
}

export default EditarScreen;