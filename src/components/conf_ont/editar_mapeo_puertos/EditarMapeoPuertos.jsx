import { useEffect, useState } from 'react';
import { Form, Button, Table, Pagination } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useConfig } from '../../../context/ConfigContext';
import Swal from "sweetalert2";

const EditarMapeoPuertos = () => {
    const { id } = useParams();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { cambiarMapeoPuertos, obtenerDatosConfigurados, dataConfig } = useConfig();
    const [loading, setLoading] = useState(true);
    const [puertos, setPuertos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        obtenerDatosConfigurados({ id }).then(() => {
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (dataConfig && dataConfig.puertos) {
            setPuertos(dataConfig.puertos);
        }
    }, [dataConfig]);

    const onSubmit = handleSubmit((data) => {
        const newPuertos = [...puertos, {
            interno: data.interno,
            externo: data.externo,
            ipHost: data.ipHost,
            nombre: data.nombre
        }];

        const formattedData = {
            id,
            puertos: newPuertos
        };

        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se guardan los cambios.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        cambiarMapeoPuertos(formattedData)
            .then(() => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El mapeo de puertos ha sido actualizado.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                setPuertos(newPuertos);
                reset();
            })
            .catch((error) => {
                console.error("Error al cambiar el mapeo de puertos:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el mapeo de puertos.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredPuertos = puertos.filter(puerto =>
        puerto.interno.includes(searchTerm) ||
        puerto.externo.includes(searchTerm) ||
        puerto.ipHost.includes(searchTerm) ||
        puerto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredPuertos.length / itemsPerPage);
    const currentTableData = filteredPuertos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleDeleteClick = (index) => {
        setConfirmDeleteId(index);
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el puerto. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteConfirmed(index);
            } else {
                setConfirmDeleteId(null);
            }
        });
    };

    const handleDeleteConfirmed = (index) => {
        const updatedPuertos = [...puertos];
        updatedPuertos.splice((currentPage - 1) * itemsPerPage + index, 1); // Calculating index in current page
        setPuertos(updatedPuertos);

        const formattedData = {
            id,
            puertos: updatedPuertos
        };

        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se guardan los cambios.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        cambiarMapeoPuertos(formattedData)
            .then(() => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El puerto ha sido eliminado.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            })
            .catch((error) => {
                console.error("Error al eliminar el puerto:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el puerto.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                setPuertos(puertos); // Revert back in case of error
            })
            .finally(() => {
                setConfirmDeleteId(null);
            });
    };

    const renderTableRows = () => {
        return currentTableData.map((puerto, index) => (
            <tr key={index}>
                <td>{puerto.interno}</td>
                <td>{puerto.externo}</td>
                <td>{puerto.ipHost}</td>
                <td>{puerto.nombre}</td>
                <td>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(index)} disabled={confirmDeleteId === index}>
                        Eliminar
                    </Button>
                </td>
            </tr>
        ));
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <span>Editar Mapeo de Puertos</span>
                        <Button variant="primary" className="float-end" onClick={() => reset()}>Nuevo</Button>
                    </div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <Form.Group className="mb-3" controlId="formInterno">
                                <Form.Label>Puerto Interno</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el puerto interno"
                                    maxLength={5}
                                    {...register("interno", {
                                        required: true, pattern: {
                                            value: /^[0-9]*$/,
                                            message: "Solo se permiten números."
                                        }, maxLength: {
                                            value: 5,
                                            message: "El puerto interno no puede tener más de 5 dígitos."
                                        }
                                    })}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                                {errors.interno && errors.interno.type === "required" && <p className="text-danger">El puerto interno es obligatorio.</p>}
                                {errors.interno && errors.interno.type === "pattern" && <p className="text-danger">{errors.interno.message}</p>}
                                {errors.interno && errors.interno.type === "maxLength" && <p className="text-danger">{errors.interno.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formExterno">
                                <Form.Label>Puerto Externo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el puerto externo"
                                    maxLength={5}
                                    {...register("externo", {
                                        required: true,
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "Solo se permiten números."
                                        },
                                        maxLength: {
                                            value: 5,
                                            message: "El puerto externo no puede tener más de 5 dígitos."
                                        }
                                    })}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                                {errors.externo && errors.externo.type === "required" && <p className="text-danger">El puerto externo es obligatorio.</p>}
                                {errors.externo && errors.externo.type === "pattern" && <p className="text-danger">{errors.externo.message}</p>}
                                {errors.externo && errors.externo.type === "maxLength" && <p className="text-danger">{errors.externo.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formIpHost">
                                <Form.Label>IP del Host</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la IP del host"
                                    {...register("ipHost", {
                                        required: true,
                                        pattern: {
                                            value: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
                                            message: "Ingrese una dirección IP válida."
                                        }
                                    })}
                                />
                                {errors.ipHost && errors.ipHost.type === "required" && <p className="text-danger">La IP del host es obligatoria.</p>}
                                {errors.ipHost && errors.ipHost.type === "pattern" && <p className="text-danger">{errors.ipHost.message}</p>}
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                    {...register("nombre", { required: true })}
                                />
                                {errors.nombre && <p className="text-danger">El nombre es obligatorio.</p>}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Guardar cambios
                            </Button>
                        </form>

                        <hr />

                        <div className="form-group row mx-0 mb-2 data-table-controls">
                            <div className="col-12 col-md-8 py-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-2">
                                <div className="row justify-content-end">
                                    <div className="col-6 col-sm-5 my-auto text-end">
                                        <label className="col-12 area-top-title"><b>Mostrar :</b></label>
                                    </div>
                                    <div className="col-6 col-sm-4">
                                        <Form.Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Puerto Interno</th>
                                    <th>Puerto Externo</th>
                                    <th>IP del Host</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <Pagination>
                                {[...Array(pageCount).keys()].map(number => (
                                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageClick(number + 1)}>
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                            <div className="total-records">
                                <p className="area-top-title">Total de registros: {filteredPuertos.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarMapeoPuertos;

