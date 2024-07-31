import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useConfig } from '../../../context/ConfigContext';
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";


const EditarWifi = () => {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { cambiarNombreClaveWifi, obtenerDatosConfigurados, dataConfig } = useConfig();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerDatosConfigurados({id}).then(() => {
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (dataConfig && dataConfig.wifi) {
            setValue("wifiName", dataConfig.wifi.ssid);
            setValue("wifiPassword", dataConfig.wifi.password);
        }
    }, [dataConfig, setValue]);

    const onSubmit = handleSubmit((data) => {
        const formattedData = {
            id,
            wifi: {
                ssid: data.wifiName,
                password: data.wifiPassword
            }
        };
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se guardan los cambios.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        cambiarNombreClaveWifi(formattedData)
            .then(() => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El nombre y la contraseña de WiFi han sido actualizados.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            })
            .catch((error) => {
                console.error("Error al cambiar nombre y clave de WiFi:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el nombre y la contraseña de WiFi.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
    });

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <span>Editar nombre y contraseña WIFI</span>
                    </div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <Form.Group className="mb-3" controlId="formWifiName">
                                <Form.Label>Nombre de WiFi</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre de WiFi"
                                    {...register("wifiName", { required: true })}
                                />
                                {errors.wifiName && <p className="text-danger">El nombre de WiFi es obligatorio.</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formWifiPassword">
                                <Form.Label>Contraseña de WiFi</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la contraseña de WiFi"
                                    {...register("wifiPassword", { required: true })}
                                />
                                {errors.wifiPassword && <p className="text-danger">La contraseña de WiFi es obligatoria.</p>}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                            <FaSave size={20}/>  Guardar cambios
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarWifi;
