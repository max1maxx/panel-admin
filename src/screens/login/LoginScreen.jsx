import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
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

    const onSubmit = handleSubmit((data) => {
        singin(data);
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dispositivos");
        }
    }, [isAuthenticated]);

    return (
        <div className="d-flex align-items-center py-4">
            <div className="form-signin w-100 m-auto">
                <form onSubmit={onSubmit}>
                    {/* <img className="mb-4" src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width={72} height={57} /> */}
                    <h1 className="h3 mb-3 fw-normal text-center">Bienvenido</h1>
                    <div className="bg-danger">
                        {signinErrors.map((errors, i) => (
                            <div className="text-white" key={i}>
                                {errors}
                            </div>
                        ))}
                    </div>
                    <div className="form-floating">
                        <input type="cedulaRUC" className="form-control" name="cedulaRUC" placeholder="Ingrese su identificación" {...register("cedulaRUC", { required: true })} />
                        <label htmlFor="cedulaRUC">Ingrese su identificación</label>
                    </div>
                    <p>{errors.cedulaRUC?.message}</p>
                    <div className="form-floating">
                        <input id="password" className="form-control" type="password" placeholder="Contraseña" {...register("password", { required: true })} />
                        <label htmlFor="password">Ingrese la contraseña</label>
                    </div>
                    <p>{errors.password?.message}</p>
                    <button type="submit" className="btn btn-primary w-100 py-2"> Iniciar sesión </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
