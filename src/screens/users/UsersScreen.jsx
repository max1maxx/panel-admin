import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineAdd } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const TABLE_HEADS = [
    "Cédula/RUC",
    "Nombres",
    "Es Admin",
    "Acciones",
];

const UsersScreen = () => {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const { getAllUsers, users, signup, updateUser, deleteUser, errors: signupErrors } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Nuevo estado para manejar la edición
    const [currentUser, setCurrentUser] = useState(null); // Nuevo estado para almacenar el usuario a editar

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredConfigs = users.filter(user =>
        user._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cedulaRUC.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredConfigs.length / itemsPerPage);
    const currentTableData = filteredConfigs.slice(
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

    const handleModalClose = () => {
        setShowModal(false);
        reset(); // Limpia el formulario cuando se cierra el modal
        setIsEditing(false); // Resetea el estado de edición
        setCurrentUser(null); // Resetea el usuario actual
    };

    const handleModalShow = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setIsEditing(true);
            setValue("cedulaRUC", user.cedulaRUC);
            setValue("names", user.names);
            setValue("isAdmin", user.isAdmin);
        } else {
            setIsEditing(false);
            setValue("cedulaRUC", '');
            setValue("names", '');
            setValue("password", '');
            setValue("isAdmin", false);
        }
        setShowModal(true);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEditing) {
                // Actualizar usuario
                const res = await updateUser({ ...data, cedulaRUC: currentUser.cedulaRUC });
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario actualizado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    handleModalClose();
                }
            } else {
                // Crear usuario
                const res = await signup(data);
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario creado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    handleModalClose();
                }
            }
        } catch (error) {
            console.error("Error al procesar el usuario:", error);
        }
    });

    const handleEditClick = (user) => {
        handleModalShow(user);
    };

    const handleDeleteClick = async (cedulaRUC) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás recuperar este usuario!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const res = await deleteUser({ cedulaRUC });
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario eliminado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getAllUsers(); // Refrescar la lista de usuarios
                }
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        }
    };

    return (
        <>
            <div className="p-2">
                <h2 className="area-top-title">Usuarios</h2>
                <Button variant="primary" onClick={() => handleModalShow()}><MdOutlineAdd size={20} /> Nuevo</Button>
            </div>
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
            <section className="content-area-table">
                <div className="data-table-info">
                    <h4 className="data-table-title">Listado de usuarios</h4>
                </div>
                <div className="data-table-diagram">
                    <table>
                        <thead>
                            <tr>
                                {TABLE_HEADS?.map((th, index) => (
                                    <th key={index}>{th}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTableData.map((dataItem) => (
                                <tr key={dataItem._id}>
                                    <td>{dataItem.cedulaRUC}</td>
                                    <td>{dataItem.names}</td>
                                    <td><Form.Check
                                        type="checkbox"
                                        checked={dataItem.isAdmin}
                                        disabled
                                    /></td>
                                    <td className="dt-cell-action">
                                        <Link className="p-2" title="Editar" onClick={() => handleEditClick(dataItem)}>
                                            <FaEdit size={20} />
                                        </Link>
                                        <Link className="p-2" title="Eliminar" onClick={() => handleDeleteClick(dataItem.cedulaRUC)}>
                                            <MdDelete size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <Pagination>
                        {[...Array(pageCount).keys()].map(number => (
                            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageClick(number + 1)}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                    <div className="total-records">
                        <p className="area-top-title">Total de registros: {filteredConfigs.length}</p>
                    </div>
                </div>
            </section>

            {/* Modal para crear o editar usuario */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        {/* Mostrar errores de validación */}
                        <div className="bg-danger">
                            {signupErrors.map((errores, i) => (
                                <div className="text-white" key={i}>
                                    {errores}
                                </div>
                            ))}
                        </div>

                        <Form.Group controlId="formIdenti" className="p-2">
                            <Form.Label>Identidad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la identidad: cédula, ruc o pasaporte"
                                {...register("cedulaRUC", {
                                    required: "La identidad es requerida", pattern: {
                                        value: /^[0-9]*$/,
                                        message: "Solo se permiten números."
                                    }
                                })}
                                disabled={isEditing} // Desactiva el campo si es edición
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            {/* Mostrar error de campo si existe */}
                            <p className="text-danger">{errors.cedulaRUC?.message}</p>
                        </Form.Group>

                        <Form.Group controlId="formNames" className="p-2">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese los nombres"
                                {...register("names", { required: "Los nombres son requeridos" })}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                }}
                            />
                            {/* Mostrar error de campo si existe */}
                            <p className="text-danger">{errors.names?.message}</p>
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="p-2">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese la contraseña"
                                {...register("password", { required: isEditing ? false : "La contraseña es requerida" })}
                            />
                            {/* Mostrar error de campo si existe */}
                            <p className="text-danger">{errors.password?.message}</p>
                        </Form.Group>

                        <Form.Group controlId="formIsAdmin" className="p-2">
                            <Form.Check
                                type="checkbox"
                                label="Es Admin"
                                {...register("isAdmin")}
                                defaultChecked={false}
                            />
                        </Form.Group>
                        <div className="p-2 text-end">
                            <Button variant="primary" type="submit">
                                <FaSave size={20} /> {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default UsersScreen;
