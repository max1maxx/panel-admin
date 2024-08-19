import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useConfig } from '../../../context/ConfigContext';
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";

const EditarLan = ({ dato }) => {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { cambiarLan } = useConfig();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [id]);

    useEffect(() => {
        if (dato && dato.lan) {
            setValue("mascara", dato.lan.mascara);
            setValue("ipMin", dato.lan.ipMin);
            setValue("ipMax", dato.lan.ipMax);
            setValue("dns", dato.lan.dns);
            setValue("ipLAN", dato.lan.ipLAN);  // Nuevo campo ipLAN
        }
    }, [dato]);

    const onSubmit = handleSubmit((data) => {
        const formattedData = {
            id,
            lan: {
                mascara: data.mascara,
                ipMin: data.ipMin,
                ipMax: data.ipMax,
                dns: data.dns,
                ipLAN: data.ipLAN  // Nuevo campo ipLAN
            }
        };
        // console.log(formattedData);

        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se guardan los cambios.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

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
                                    {...register("mascara", {
                                        required: true,
                                        pattern: {
                                            value: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
                                            message: "Ingrese una máscara de subred válida."
                                        }
                                    })}
                                />
                                {errors.mascara && errors.mascara.type === "required" && <p className="text-danger">La máscara de subred es obligatoria.</p>}
                                {errors.mascara && errors.mascara.type === "pattern" && <p className="text-danger">{errors.mascara.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formIpLAN">
                                <Form.Label>IP LAN</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la IP LAN"
                                    {...register("ipLAN", {
                                        required: true,
                                        pattern: {
                                            value: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
                                            message: "Ingrese una IP LAN válida."
                                        }
                                    })}
                                />
                                {errors.ipLAN && errors.ipLAN.type === "required" && <p className="text-danger">La IP LAN es obligatoria.</p>}
                                {errors.ipLAN && errors.ipLAN.type === "pattern" && <p className="text-danger">{errors.ipLAN.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formIpMin">
                                <Form.Label>IP Mínima</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la IP mínima"
                                    {...register("ipMin", {
                                        required: true,
                                        pattern: {
                                            value: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
                                            message: "Ingrese una IP mínima válida."
                                        }
                                    })}
                                />
                                {errors.ipMin && errors.ipMin.type === "required" && <p className="text-danger">La IP mínima es obligatoria.</p>}
                                {errors.ipMin && errors.ipMin.type === "pattern" && <p className="text-danger">{errors.ipMin.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formIpMax">
                                <Form.Label>IP Máxima</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la IP máxima"
                                    {...register("ipMax", {
                                        required: true,
                                        pattern: {
                                            value: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
                                            message: "Ingrese una IP máxima válida."
                                        }
                                    })}
                                />
                                {errors.ipMax && errors.ipMax.type === "required" && <p className="text-danger">La IP máxima es obligatoria.</p>}
                                {errors.ipMax && errors.ipMax.type === "pattern" && <p className="text-danger">{errors.ipMax.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDns">
                                <Form.Label>DNS</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese los DNS"
                                    {...register("dns", {
                                        required: true,
                                        pattern: {
                                            value: /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(,\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})*$/,
                                            message: "Ingrese direcciones DNS válidas, separadas por comas si hay múltiples (por ejemplo, 8.8.8.8,1.1.1.1)."
                                        }
                                    })}
                                />
                                {errors.dns && errors.dns.type === "required" && <p className="text-danger">Los DNS son obligatorios.</p>}
                                {errors.dns && errors.dns.type === "pattern" && <p className="text-danger">{errors.dns.message}</p>}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                <FaSave size={20} /> Guardar cambios
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarLan;
