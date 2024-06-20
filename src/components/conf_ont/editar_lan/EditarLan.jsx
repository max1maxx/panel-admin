import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useConfig } from '../../../context/ConfigContext';
import Swal from "sweetalert2";

const EditarLan = () => {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { cambiarLan, obtenerDatosConfigurados, dataConfig } = useConfig();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerDatosConfigurados({ id }).then(() => {
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (dataConfig && dataConfig.lan) {
            setValue("mascara", dataConfig.lan.mascara);
            setValue("ipMin", dataConfig.lan.ipMin);
            setValue("ipMax", dataConfig.lan.ipMax);
            setValue("dns", dataConfig.lan.dns);
        }
    }, [dataConfig, setValue]);

    const onSubmit = handleSubmit((data) => {
        const formattedData = {
            id,
            lan: {
                mascara: data.mascara,
                ipMin: data.ipMin,
                ipMax: data.ipMax,
                dns: data.dns
            }
        };
        console.log(formattedData);
        cambiarLan(formattedData)
            .then(() => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La configuración LAN ha sido actualizada.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            })
            .catch((error) => {
                console.error("Error al cambiar la configuración LAN:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar la configuración LAN.',
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
                        <span>Editar configuración LAN</span>
                    </div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <Form.Group className="mb-3" controlId="formMascara">
                                <Form.Label>Máscara de Subred</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la máscara de subred"
                                    {...register("mascara", { required: true })}
                                />
                                {errors.mascara && <p className="text-danger">La máscara de subred es obligatoria.</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formIpMin">
                                <Form.Label>IP Mínima</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la IP mínima"
                                    {...register("ipMin", { required: true })}
                                />
                                {errors.ipMin && <p className="text-danger">La IP mínima es obligatoria.</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formIpMax">
                                <Form.Label>IP Máxima</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la IP máxima"
                                    {...register("ipMax", { required: true })}
                                />
                                {errors.ipMax && <p className="text-danger">La IP máxima es obligatoria.</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDns">
                                <Form.Label>DNS</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese los DNS"
                                    {...register("dns", { required: true })}
                                />
                                {errors.dns && <p className="text-danger">Los DNS son obligatorios.</p>}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Guardar cambios
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarLan;
