import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import "./Login.scss";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { singin, isAuthenticated, errors: signinErrors } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Mostrar pantalla de carga
        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Por favor, espere un momento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            // Llamar a la función de inicio de sesión
            await singin(data);
            // Cerrar la pantalla de carga y redirigir si la autenticación es exitosa
            Swal.close();
        } catch (error) {
            // Cerrar la pantalla de carga
            Swal.close();

            // Mostrar mensaje de error de conexión
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un problema con la conexión. Intente más tarde.',
            });
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dispositivos");
        }
    }, [isAuthenticated]);

    return (
        <div className="d-flex align-items-center py-4">
            <div className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="h3 mb-3 fw-normal text-center">Bienvenido</h1>
                    <div className="bg-danger">
                        {signinErrors.map((errores, i) => (
                            <div className="text-white" key={i}>
                                {errores}
                            </div>
                        ))}
                    </div>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            name="cedulaRUC"
                            placeholder="Ingrese su identificación"
                            {...register("cedulaRUC", { required: true })}
                        />
                        <label htmlFor="cedulaRUC">Ingrese su identificación</label>
                    </div>
                    <p className="text-danger">{errors.cedulaRUC?.message}</p>
                    <div className="form-floating">
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            placeholder="Contraseña"
                            {...register("password", { required: true })}
                        />
                        <label htmlFor="password">Ingrese la contraseña</label>
                    </div>
                    <p className="text-danger">{errors.password?.message}</p>
                    <button type="submit" className="btn btn-primary w-100 py-2"> Iniciar sesión </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
