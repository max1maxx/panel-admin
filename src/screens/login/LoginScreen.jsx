import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { singin, isAuthenticated, errors: signinErrors } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data) => {
        singin(data);
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated]);

    return (
        <div
            className="content-area"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <div className="row">
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Bienvenido
                </h2>
                <div className='bg-danger'>
                    {signinErrors.map((errors, i) => (
                        <div className='text-red' key={i}>{errors}</div>
                    ))}
                </div>
                <form
                    style={{ display: "flex", flexDirection: "column", width: "300px" }}
                    onSubmit={onSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Ingrese el email"
                        {...register("email", { required: true })}
                        style={{ margin: "10px 0", padding: "10px" }}
                    />
                    <p>{errors.email?.message}</p>
                    <input
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        {...register("password", { required: true, minLength: 6 })}
                        style={{ margin: "10px 0", padding: "10px" }}
                    />
                    <p>{errors.password?.message}</p>
                    <button
                        type="submit"
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            border: "1px solid black",
                        }}
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
