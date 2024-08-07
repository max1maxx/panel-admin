import { useEffect, useState } from "react";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { useConfig } from "../../context/ConfigContext";
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TfiReload } from "react-icons/tfi";
import Swal from "sweetalert2";

const TABLE_HEADS = [
    "Cédula/RUC",
    "Fabricante",
    "WAN IP",
    "Modelo",
    "Puerto PON",
    "Acciones",
];

const Config = () => {
    const { getDevices, configs, resetear } = useConfig();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [disabledButtons, setDisabledButtons] = useState([]);

    useEffect(() => {
        getDevices();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredConfigs = configs.filter(config =>
        config._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.cedulaRUC.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.ipWAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.puertoPON.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleReset = (id) => {
        Swal.fire({
            title: 'Está seguro?',
            text: 'Esta acción reseteará el dispositivo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Resetear!'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                setDisabledButtons([...disabledButtons, id]);

                resetear({ id })
                    .then((result) => {
                        if (result.success) {
                            Swal.fire(
                                'Reseteado!',
                                result.message,
                                'success'
                            );
                        } else {
                            Swal.fire(
                                'Error!',
                                result.message,
                                'error'
                            );
                        }
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Error!',
                            'Hubo un error inesperado al resetear el dispositivo.',
                            'error'
                        );
                        console.error('Error en resetear:', error);
                    })
                    .finally(() => {
                        setLoading(false);
                        setDisabledButtons(disabledButtons.filter(btnId => btnId !== id));
                    });
            }
        });
    };


    return (
        <>
            <div className="p-2">
                <h2 className="area-top-title">Dispositivos</h2>
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
                    <h4 className="data-table-title">Listado de dispositivos ONT</h4>
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
                            {currentTableData.map((dataItem) => {
                                return (
                                    <tr key={dataItem._id}>
                                        <td>{dataItem.cedulaRUC}</td>
                                        <td>{dataItem.marca}</td>
                                        <td>{dataItem.ipWAN}</td>
                                        <td>{dataItem.modelo}</td>
                                        <td>{dataItem.puertoPON}</td>
                                        <td className="dt-cell-action">
                                            {/* <AreaTableAction id={dataItem._id} /> */}
                                            <Link className="p-2" title="Editar" to={`/editar/${dataItem._id}`}>
                                                <FaEdit size={20} />
                                            </Link>
                                            <Link className="p-2" title="Resetear dispositivo" onClick={() => handleReset(dataItem._id)}>
                                                <TfiReload size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
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
        </>
    );
};

export default Config;
