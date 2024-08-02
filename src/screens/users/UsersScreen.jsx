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
const TABLE_HEADS = [
    "Cédula/RUC",
    "Nombres",
    "Es Admin",
    "Acciones",
];

const UsersScreen = () => {
    const { register, handleSubmit, formState: { errors }} = useForm();
    const { getAllUsers, users, signup, errors: signupErrors } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getAllUsers();
        console.log("el error es " + errors);
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredConfigs = users.filter(user =>
        user._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.identi.toLowerCase().includes(searchTerm.toLowerCase())
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
    };

    const handleModalShow = () => setShowModal(true);

    const onSubmit = handleSubmit((data) => {
        signup(data);
    });

    return (
        <>
            <div className="p-2">
                <h2 className="area-top-title">Usuarios</h2>
                <Button variant="primary" onClick={handleModalShow}><MdOutlineAdd size={20} /> Nuevo</Button>
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
                                    <td>{dataItem.identi}</td>
                                    <td>{dataItem.names}</td>
                                    <td><Form.Check
                                        type="checkbox"
                                        checked={dataItem.isAdmin}
                                        disabled
                                    /></td>
                                    <td className="dt-cell-action">
                                        <Link className="p-2" title="Editar">
                                            <FaEdit size={20} />
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

            {/* Modal para crear usuario */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Mostrar errores de validación */}
                        <div className="bg-danger">
                            {signupErrors.map((errors, i) => (
                                <div className="text-white" key={i}>
                                    {errors}
                                </div>
                            ))}
                        </div>

                        <Form.Group controlId="formIdenti" className="p-2">
                            <Form.Label>Identidad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la identidad: cédula, pasaporte, etc..."
                                {...register("identi", { required: true, pattern: {
                                    value: /^[0-9]*$/,
                                    message: "Solo se permiten números."
                                } })}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            {/* Mostrar error de campo si existe */}
                            <p className="text-danger">{errors.identi?.message}</p>
                        </Form.Group>

                        <Form.Group controlId="formNames" className="p-2">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese los nombres"
                                {...register("names", { required: "Los nombres son requeridos" })}
                            />
                            {/* Mostrar error de campo si existe */}
                            <p className="text-danger">{errors.names?.message}</p>
                        </Form.Group>

                        <Form.Group controlId="formNames" className="p-2">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese la contraseña"
                                {...register("password", { required: "Los nombres son requeridos" })}
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
                                <FaSave size={20} /> Crear Usuario
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default UsersScreen;
